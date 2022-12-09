import { Kafka, logLevel } from 'kafkajs';
import config from '../config';
import ProductService from '../service/product-service';

const KAFKA_GROUP = 'product-group';
const KAFKA_TOPIC = 'product-topic';

// Function to initialize Kafka client
export const CreateKafkaClient = async () => {
    const brokerURL = config.KAFKA_BROKER;
    
    const kafka = new Kafka({
        clientId: 'microservices-base',
        brokers: [brokerURL],
        logLevel: logLevel.ERROR,
    });

    return kafka;
}

// Function used for publishing Kafka events
export const KafkaPublish = async (kafka:Kafka, topic:string, payload:any) => {

    // Create and connect producer
    const producer = kafka.producer();
    await producer.connect();

    // Publish message
    await producer.send({
        topic: topic,
        messages: [
            { value: payload },
        ],
    });

    // Disconnect producer after publishing
    await producer.disconnect();
}


// Subscribe function that creates a consumer with this services unique groupId and topic
export const KafkaSubscribe = async (kafka:Kafka, service:ProductService) => {
    // Create and connect consumer
    const consumer = kafka.consumer({ groupId: KAFKA_GROUP });
    await consumer.connect();

    // Subscribe to the topic assigned for this microservice
    await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true });

    // Run the consumer and handle each message
    await consumer.run({
        eachMessage: async ({message}) => {
            if(message.value) {
                // Run through product-service HandlePayload function
                service.HandlePayload(message.value.toString());
            }
        }
    });
}