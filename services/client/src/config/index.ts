import dotenv from 'dotenv';

if(process.env.NODE_ENV !== 'production') {
    const cfg = `./.env.${process.env.NODE_ENV}`;
    dotenv.config({path: cfg});
}else {
    dotenv.config();
}

export default {
    PORT: process.env.PORT,
    SECRET: process.env.SECRET,
    DB: process.env.DB,
    KAFKA_BROKER: process.env.KAFKA_BROKER || '',
}