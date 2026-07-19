import express, { Application, type Express, type Request, type Response } from 'express';

export const app: Application = express();


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});