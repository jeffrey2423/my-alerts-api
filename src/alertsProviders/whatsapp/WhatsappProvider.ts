import { Axios } from "axios";
import { IAlertProvider } from "../../interfaces/IAlertProvider";

export class WhatsappProvider implements IAlertProvider {
    axios: Axios;
    private token?: string;

    constructor() {
       this.axios = new Axios(); 
    }

    InitProvider(data: any): void {
        throw new Error("Method not implemented.");
    }

    SendAlert(data: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    private async CallWhatsappApi(data: any): Promise<any> {
        try {
            const response = await this.axios.post("https://api.chat-api.com/instance12345/sendMessage?token=token12345", data);
            return response;
        } catch (error) {
            throw error;
        }
    }
}