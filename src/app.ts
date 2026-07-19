import cookieParser from 'cookie-parser';
import express, { Application, type Express, type Request, type Response } from 'express';
import cors from "cors"
import config from './config';
import morgan from 'morgan';
export const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials:true
}))
app.use(morgan("dev"))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});