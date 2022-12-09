import { Express, NextFunction, Request, Response } from "express"
import ClientService from "../service/client-service";
import { KafkaPublish, KafkaSubscribe } from '../util/broker';
import { Kafka } from "kafkajs";

const ClientAPI = (app:Express, kafka:Kafka) => {

    // Create instance of client service
    const clientService = new ClientService();
    
    // Subscribe to Kafka events
    KafkaSubscribe(kafka, clientService);

    // Test endpoint
    app.get('/list', async (req:Request, res:Response, next:NextFunction) => {
        // Get list of clients using the client service
        const result = await clientService.GetClientList();
        return res.status(200).json({result});
    });

    // Endpoint to ping product service
    app.get('/ping-product', async (req:Request, res:Response, next:NextFunction) => {
        // Create payload to send
        const payload = {
            event: 'PING',
            data: { msg: 'Hello from client service'}
        }

        // Publish the payload to product-topic using Kafka
        KafkaPublish(kafka, 'product-topic', JSON.stringify(payload));

        // Feedback response
        return res.status(200).json({msg: 'Pinged product service'});
    });

    // Endpoint to ping user service
    app.get('/ping-user', async (req:Request, res:Response, next:NextFunction) => {
        // Create payload to send
        const payload = {
            event: 'PING',
            data: { msg: 'Hello from client service'}
        }

        // Publish the payload to user-topic using Kafka
        KafkaPublish(kafka, 'user-topic', JSON.stringify(payload));

        // Feedback response
        return res.status(200).json({msg: 'Pinged user service'});
    });
}

export default ClientAPI;