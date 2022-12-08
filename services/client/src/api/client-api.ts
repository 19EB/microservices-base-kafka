import { Express, NextFunction, Request, Response } from "express"
import ClientService from "../service/client-service";
import { KafkaPublish, KafkaSubscribe } from '../util/broker';
import { Kafka } from "kafkajs";

const ClientAPI = (app:Express, kafka:Kafka) => {

    const clientService = new ClientService();
    KafkaSubscribe(kafka, clientService);

    app.get('/list', async (req:Request, res:Response, next:NextFunction) => {
        const result = await clientService.GetClientList();
        return res.status(200).json({result});
    });

    app.get('/ping-product', async (req:Request, res:Response, next:NextFunction) => {
        const payload = {
            event: 'PING',
            data: { msg: 'Hello from client service'}
        }
        KafkaPublish(kafka, 'product-topic', JSON.stringify(payload));
        return res.status(200).json({msg: 'Pinged product service'});
    });

    app.get('/ping-user', async (req:Request, res:Response, next:NextFunction) => {
        const payload = {
            event: 'PING',
            data: { msg: 'Hello from client service'}
        }
        KafkaPublish(kafka, 'user-topic', JSON.stringify(payload));
        return res.status(200).json({msg: 'Pinged user service'});
    });

}

export default ClientAPI;