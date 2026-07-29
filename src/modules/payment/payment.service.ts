import { prisma } from "../../lib/prisma.js";
import Stripe from "stripe";
import config from "../../config/index.js";

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: "2026-06-24.dahlia",
});

const createCheckoutSession = async (rentalId: string, userId: string) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id: rentalId },
    include: {
      property: {
        select: { id: true, title: true, rent: true, address: true },
      },
    },
  });

  if (!rental) {
    throw new Error("Rental request not found");
  }

  if (rental.tenantId !== userId) {
    throw new Error("You are not authorized to pay for this rental");
  }

  if (rental.status !== "APPROVED") {
    throw new Error("You can only pay for approved rental requests");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { rentalId },
  });

  if (existingPayment && existingPayment.status === "PAID") {
    throw new Error("This rental has already been paid for");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Rent: ${rental.property.title}`,
            description: `Rental payment for ${rental.property.address}`,
          },
          unit_amount: Math.round(rental.property.rent * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${config.client_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.client_url}/payment/cancel`,
    metadata: {
      rentalId,
      userId,
    },
  });

  if (existingPayment) {
    await prisma.payment.update({
      where: { rentalId },
      data: {
        transactionId: session.id,
        status: "PENDING",
      },
    });
  } else {
    await prisma.payment.create({
      data: {
        rentalId,
        amount: rental.property.rent,
        provider: "STRIPE",
        transactionId: session.id,
        status: "PENDING",
      },
    });
  }

  return {
    sessionId: session.id,
    url: session.url,
  };
};

const confirmPayment = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new Error("Invalid session");
  }

  const rentalId = session.metadata?.rentalId;

  if (!rentalId) {
    throw new Error("Invalid session metadata");
  }

  const payment = await prisma.payment.findUnique({
    where: { rentalId },
  });

  if (!payment) {
    throw new Error("Payment record not found");
  }

  if (session.payment_status === "paid") {
    const updatedPayment = await prisma.payment.update({
      where: { rentalId },
      data: {
        status: "PAID",
        paidAt: new Date(),
        transactionId: session.payment_intent as string,
      },
    });

    await prisma.rentalRequest.update({
      where: { id: rentalId },
      data: { status: "ACTIVE" },
    });

    return updatedPayment;
  } else {
    await prisma.payment.update({
      where: { rentalId },
      data: { status: "FAILED" },
    });

    throw new Error("Payment was not successful");
  }
};

const getPaymentHistory = async (userId: string) => {
  const payments = await prisma.payment.findMany({
    where: {
      rental: {
        tenantId: userId,
      },
    },
    include: {
      rental: {
        include: {
          property: {
            select: { id: true, title: true, address: true, rent: true },
          },
        },
      },
    },
    orderBy: { paidAt: "desc" },
  });

  return payments;
};

const getPaymentById = async (id: string, userId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      rental: {
        include: {
          tenant: {
            select: { id: true, name: true, email: true },
          },
          property: {
            select: { id: true, title: true, address: true, rent: true },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (
    payment.rental.tenantId !== userId &&
    payment.rental.property &&
    (payment.rental as any).property?.landlordId !== userId
  ) {
    throw new Error("You are not authorized to view this payment");
  }

  return payment;
};

export const PaymentService = {
  createCheckoutSession,
  confirmPayment,
  getPaymentHistory,
  getPaymentById,
};
