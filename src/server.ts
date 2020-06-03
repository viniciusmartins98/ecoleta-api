// Para utilizar o TypeScript é necessário instalar a definição de tipos "npm install @types/express"
import express from 'express';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);

app.listen(3333);