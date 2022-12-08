import express, { Express, Request, Response, NextFunction } from "express";
import cors from 'cors';
import ClientAPI from "./api/client-api";
import { Kafka } from "kafkajs";

const ExpressLogic = async (app:Express, kafka:Kafka) => {

    app.use(express.json({ limit: '1mb' }));
    app.use(cors());

    ClientAPI(app, kafka);

    app.use('/', (req:Request, res:Response, next:NextFunction)=>{
        return res.status(200).json({msg: 'Client service response'});
    });
    
}

export default ExpressLogic;