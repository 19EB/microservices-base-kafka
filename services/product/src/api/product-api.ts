import { Express, NextFunction, Request, Response } from "express"
import ProductService from "../service/product-service";
import { KafkaSubscribe, KafkaPublish } from "../util/broker";
import { Kafka } from "kafkajs";

const ProductAPI = (app:Express, kafka:Kafka) => {

    // Create instance of product service
    const productService = new ProductService();

    // Subscribe to Kafka events
    KafkaSubscribe(kafka, productService);

    // Test endpoint
    app.get('/list', async (req:Request, res:Response, next:NextFunction) => {
        // Get list of products using the product service
        const result = await productService.GetProductList();
        return res.status(200).json({result});
    });

    // Endpoint to ping client service
    app.get('/ping-client', async (req:Request, res:Response, next:NextFunction) => {
        // Create payload to send
        const payload = {
            event: 'PING',
            data: { msg: 'Hello from product service'}
        }

        // Publish the payload to client-topic using Kafka
        KafkaPublish(kafka, 'client-topic', JSON.stringify(payload));

        // Feedback response
        return res.status(200).json({msg: 'Pinged client service'});
    });

    // Endpoint to ping user service
    app.get('/ping-user', async (req:Request, res:Response, next:NextFunction) => {
        // Create payload to send
        const payload = {
            event: 'PING',
            data: { msg: 'Hello from product service'}
        }

        // Publish the payload to user-topic using Kafka
        KafkaPublish(kafka, 'user-topic', JSON.stringify(payload));

        // Feedback response
        return res.status(200).json({msg: 'Pinged user service'});
    });

}

export default ProductAPI;