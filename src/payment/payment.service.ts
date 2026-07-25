import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-06-30.basil" as any,
});

const createPaymentIntent = async (rentalId: string, userId: string) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id: rentalId },
    include: {
      property: { select: { rent: true, title: true, landlordId: true } },
      tenant: { select: { id: true } },
    },
  });

  if (!rental) {
    throw new Error("Rental request not found");
  }

  if (rental.tenantId !== userId) {
    throw new Error("You can only make payments for your own rental requests");
  }

  if (rental.status !== "APPROVED") {
    throw new Error("Payment can only be made for approved rental requests");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { rentalId },
  });

  if (existingPayment && existingPayment.status === "PAID") {
    throw new Error("Payment has already been completed for this rental");
  }

  const amount = rental.property.rent;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    metadata: {
      rentalId,
      userId,
      propertyTitle: rental.property.title,
    },
  });

  if (existingPayment) {
    await prisma.payment.update({
      where: { rentalId },
      data: {
        transactionId: paymentIntent.id,
        status: "PENDING",
      },
    });
  } else {
    await prisma.payment.create({
      data: {
        rentalId,
        amount,
        provider: "STRIPE",
        transactionId: paymentIntent.id,
        status: "PENDING",
      },
    });
  }

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    amount,
  };
};

const confirmPayment = async (paymentIntentId: string) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === "succeeded") {
    const payment = await prisma.payment.findFirst({
      where: { transactionId: paymentIntentId },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });

      await prisma.rentalRequest.update({
        where: { id: payment.rentalId },
        data: { status: "ACTIVE" },
      });
    }

    return { status: "completed", paymentIntentId };
  }

  return { status: paymentIntent.status, paymentIntentId };
};

const createSslCommerzPayment = async (rentalId: string, userId: string) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id: rentalId },
    include: {
      property: { select: { rent: true, title: true } },
      tenant: { select: { id: true, email: true, name: true } },
    },
  });

  if (!rental) {
    throw new Error("Rental request not found");
  }

  if (rental.tenantId !== userId) {
    throw new Error("You can only make payments for your own rental requests");
  }

  if (rental.status !== "APPROVED") {
    throw new Error("Payment can only be made for approved rental requests");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { rentalId },
  });

  if (existingPayment && existingPayment.status === "PAID") {
    throw new Error("Payment has already been completed for this rental");
  }

  const transactionId = `SSLC_${uuidv4()}`;
  const amount = rental.property.rent;

  if (existingPayment) {
    await prisma.payment.update({
      where: { rentalId },
      data: {
        transactionId,
        provider: "SSLCOMMERZ",
        status: "PENDING",
      },
    });
  } else {
    await prisma.payment.create({
      data: {
        rentalId,
        amount,
        provider: "SSLCOMMERZ",
        transactionId,
        status: "PENDING",
      },
    });
  }

  return {
    transactionId,
    amount,
    currency: "BDT",
    storeBrandName: "RentNest",
  };
};

const confirmSslCommerzPayment = async (
  transactionId: string,
  status: string,
) => {
  const payment = await prisma.payment.findFirst({
    where: { transactionId },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (status === "VALID" || status === "success") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    await prisma.rentalRequest.update({
      where: { id: payment.rentalId },
      data: { status: "ACTIVE" },
    });

    return { status: "completed", transactionId };
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "FAILED" },
  });

  return { status: "failed", transactionId };
};

const getUserPayments = async (userId: string) => {
  const payments = await prisma.payment.findMany({
    where: {
      rental: { tenantId: userId },
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
          property: {
            select: { id: true, title: true, address: true, rent: true },
          },
          tenant: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.rental.tenantId !== userId) {
    throw new Error("You are not authorized to view this payment");
  }

  return payment;
};

export const PaymentService = {
  createPaymentIntent,
  confirmPayment,
  createSslCommerzPayment,
  confirmSslCommerzPayment,
  getUserPayments,
  getPaymentById,
};
