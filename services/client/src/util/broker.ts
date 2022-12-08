import { Kafka, logLevel } from 'kafkajs';
import config from '../config';
import ClientService from '../service/client-service';

const KAFKA_GROUP = 'client-group';
const KAFKA_TOPIC = 'client-topic';

export const CreateKafkaClient = async () => {

    const brokerURL = config.KAFKA_BROKER;

    const kafka = new Kafka({
        clientId: 'microservices-base',
        brokers: [brokerURL],
        logLevel: logLevel.ERROR,
    });
    return kafka;
}

export const KafkaPublish = async (kafka:Kafka, topic:string, payload:any) => {
    const producer = kafka.producer();
    await producer.connect();

    // Publish message
    await producer.send({
        topic: topic,
        messages: [
            { value: payload },
        ],
    });

    await producer.disconnect();
}

export const KafkaSubscribe = async (kafka:Kafka, service:ClientService) => {
    const consumer = kafka.consumer({ groupId: KAFKA_GROUP });

    await consumer.connect();

    await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({message}) => {
            if(message.value) {
                service.HandlePayload(message.value.toString());
            }
        }
    });
}