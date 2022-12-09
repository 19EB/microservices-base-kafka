import express from 'express';
import dbConnection from './database/connection';
import ExpressLogic from './express-logic';
import config from './config';

import { CreateKafkaClient } from './util/broker';

const Start = async() => {
    console.log(`Running server in mode: ${process.env.NODE_ENV}`);
    const app = express();
    
    // Connect to database
    await dbConnection();

    // Create kafka client that will be attached to the express-api
    const kafka = await CreateKafkaClient();

    // Express api
    await ExpressLogic(app, kafka);
    
    app.listen(config.PORT, ()=>{
        console.log(`Product service running at port ${config.PORT}`);
    }).on('error', (err:Error) => {
        console.log(err);
        process.exit();
    });
}

// Start the application
Start();

