import { Express, NextFunction, Request, Response } from "express"
import UserService from "../service/user-service";
import { KafkaSubscribe, KafkaPublish } from "../util/broker";
import { Kafka } from 'kafkajs';

const UserAPI = (app:Express, kafka:Kafka) => {

    // Create instance of user service
    const userService = new UserService();

    // Subscribe to Kafka events
    KafkaSubscribe(kafka, userService);
    
    // Test endpoint
    app.get('/list', async (req:Request, res:Response, next:NextFunction) => {
        // Get list of users using the user service
        const result = await userService.GetUserList();
        return res.status(200).json({result});
    });

    // Endpoint to ping client service
    app.get('/ping-client', async (req:Request, res:Response, next:NextFunction) => {
        // Create payload to send
        const payload = {
            event: 'PING',
            data: { msg: 'Hello from user service'}
        }

        // Publish the payload to client-topic using Kafka
        KafkaPublish(kafka, 'client-topic', JSON.stringify(payload));

        // Feedback response
        return res.status(200).json({msg: 'Pinged client service'});
    });


    // Endpoint to ping product service
    app.get('/ping-product', async (req:Request, res:Response, next:NextFunction) => {
        // Create payload to send
        const payload = {
            event: 'PING',
            data: { msg: 'Hello from user service'}
        }

        // Publish the payload to product-topic using Kafka
        KafkaPublish(kafka, 'product-topic', JSON.stringify(payload));

        // Feedback response
        return res.status(200).json({msg: 'Pinged product service'});
    });

}

export default UserAPI;