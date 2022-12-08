import { Express, NextFunction, Request, Response } from "express"
import ProductService from "../service/product-service";
import { KafkaSubscribe, KafkaPublish } from "../util/broker";
import { Kafka } from "kafkajs";

const ProductAPI = (app:Express, kafka:Kafka) => {

    const productService = new ProductService();
    KafkaSubscribe(kafka, productService);

    app.get('/list', async (req:Request, res:Response, next:NextFunction) => {
        const result = await productService.GetProductList();
        return res.status(200).json({result});
    });

    app.get('/ping-client', async (req:Request, res:Response, next:NextFunction) => {
        const payload = {
            event: 'PING',
            data: { msg: 'Hello from product service'}
        }
        KafkaPublish(kafka, 'client-topic', JSON.stringify(payload));
        return res.status(200).json({msg: 'Pinged client service'});
    });

    app.get('/ping-user', async (req:Request, res:Response, next:NextFunction) => {
        const payload = {
            event: 'PING',
            data: { msg: 'Hello from product service'}
        }
        KafkaPublish(kafka, 'user-topic', JSON.stringify(payload));
        return res.status(200).json({msg: 'Pinged user service'});
    });

}

export default ProductAPI;