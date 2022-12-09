import express, { Express, Request, Response, NextFunction } from "express";
import cors from 'cors';
import UserAPI from "./api/user-api";
import { Kafka } from 'kafkajs';

const ExpressLogic = async (app:Express, kafka:Kafka) => {

    app.use(express.json({ limit: '1mb' }));
    app.use(cors());

    // Bind user-api to express
    UserAPI(app, kafka);

    // Default api response
    app.use('/', (req:Request, res:Response, next:NextFunction)=>{
        return res.status(200).json({msg: 'User service response'});
    });
    
}

export default ExpressLogic;