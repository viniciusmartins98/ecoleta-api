import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
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
            image: 'image-fake',
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
        trx.commit();
        
        // Retorna o ponto inserido juntamente com o seu id
        return res.json({
            id: point_id,
            ...point,
            items: items
        });
    }
}

export default PointsController;