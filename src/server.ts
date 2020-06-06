// Para utilizar o TypeScript é necessário instalar a definição de tipos "npm install @types/express"
import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

// Função para servir arquivos estaticos
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.listen(3333);