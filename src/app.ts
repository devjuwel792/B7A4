import cookieParser from 'cookie-parser';
import express, { Application, type Express, type Request, type Response } from 'express';
import cors from "cors"
import config from './config';
import morgan from 'morgan';
import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

export const app: Application = express();

app.use(cors({
  origin: config.app_url,
  credentials: true
}))
app.use(morgan("dev"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { name, email, password, phone, status, role } = req.body;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  })
  if (isUserExist) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    })
  }

  const hashpassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashpassword,
      phone,
      status,
      role
    }
  })
  res.status(201).json({
    success: true,
    message: "User created successfully",
  })


});