import { Express, NextFunction, Request, Response } from "express"
import UserService from "../service/user-service";
import { KafkaSubscribe, KafkaPublish } from "../util/broker";
import { Kafka } from 'kafkajs';

const UserAPI = (app:Express, kafka:Kafka) => {

    const userService = new UserService();

    KafkaSubscribe(kafka, userService);
    
    app.get('/list', async (req:Request, res:Response, next:NextFunction) => {
        const result = await userService.GetUserList();
        return res.status(200).json({result});
    });

    app.get('/ping-client', async (req:Request, res:Response, next:NextFunction) => {
        const payload = {
            event: 'PING',
            data: { msg: 'Hello from user service'}
        }
        KafkaPublish(kafka, 'client-topic', JSON.stringify(payload));
        return res.status(200).json({msg: 'Pinged client service'});
    });

    app.get('/ping-product', async (req:Request, res:Response, next:NextFunction) => {
        const payload = {
            event: 'PING',
            data: { msg: 'Hello from user service'}
        }
        KafkaPublish(kafka, 'product-topic', JSON.stringify(payload));
        return res.status(200).json({msg: 'Pinged product service'});
    });

}

export default UserAPI;