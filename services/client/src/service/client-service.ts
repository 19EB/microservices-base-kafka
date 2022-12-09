import ClientRepository from '../database/repository/client-repository';

class ClientService {

    repository:ClientRepository;

    constructor() {
        this.repository = new ClientRepository();
    }

    GetClientList = async () => {
        // Get list of clients from repository
        const clientList = await this.repository.GetClients();
        return clientList;
    }
    
    // This function gets called when it receives a ping event from Kafka
    ReceivePing = async (data:any) => {
        console.log('Your service just got pinged:');
        console.log(data);
    }

    // Handle payload received from Kafka
    HandlePayload = async (payload:any) => {
        // For these services, payload will always consist of 'event' that describes what function gets called and 'data' that has all the necessary data inside
        const {event, data} = JSON.parse(payload);
        // Log what event got sent
        console.log(event);

        // Handle which function gets called
        switch(event) {
            case 'PING':
                this.ReceivePing(data);
                break;
            default:
                break;
        }
    }
}

export default ClientService;