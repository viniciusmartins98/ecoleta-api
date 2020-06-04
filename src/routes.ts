import express, { response } from 'express';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);
routes.post('/points', pointsController.create);

// Métodos padrões REST:
// index = listagem, show = exibr um, create = criar, update = atualizar, delete = deletar

export default routes;
