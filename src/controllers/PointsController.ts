import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {

    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        return response.json(points);
    }

    async show(req: Request, res: Response) {
        const { id } = req.params;
    
        const point = await knex('points').where('id', id).first();

        if(!point) {
            return res.status(400).json({ message: 'Point not found,' });
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return res.json({ point, items });
    }

    async create(req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;
        
        // Mantém consistência no banco, ou realiza todas as operações ou não executa nada
        const trx = await knex.transaction();

        // Atribui os dados do formulário à um objeto
        const point = {
            image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        // Insere e retorna o id dos itens inseridos, no caso retornará o ID do ponto inserido
        const insertedIds = await trx('points').insert(point);
        
        // Atribui o id do ponto inserido à uma variável, para ficar mais entendível
        const point_id = insertedIds[0];
        
        // Cria o objeto que será inserido na tabela de relação point_items, relaciona os itens enviados ao ponto inserido
        const pointItems = items.map((item_id: number) => {
            return {
                point_id: point_id, // Para 1 ponto, terei vários itens inseridos
                item_id: item_id
            };
        });

        // Insere a relação no banco de dados, envia um array de objetos {point_id, item_id}
        await trx('point_items').insert(pointItems);
        await trx.commit();
        
        // Retorna o ponto inserido juntamente com o seu id
        return res.json({
            id: point_id,
            ...point,
            items: items
        });
    }
}

export default PointsController;