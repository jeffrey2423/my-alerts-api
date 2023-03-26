import { IAlertProvider } from "../interfaces/IAlertProvider";
import { AlertsProviders } from "../types";
import { WhatsappProvider } from "./whatsapp/WhatsappProvider";

export class Provider {
    private provider?: IAlertProvider;

    constructor(provider: AlertsProviders, data: any) {
        this.InitProvider(provider, data);
    }

    private InitProvider(provider: AlertsProviders, data: any): void {
        try {
            switch (provider) {
                case AlertsProviders.Whatsapp:
                    this.provider = new WhatsappProvider();
                    break;
                default:
                    throw new Error("Provider not found");
            }
    
            this.provider.InitProvider(data);
        } catch (error) {
            throw error;
        }
    }

    public async SendAlert(data: any): Promise<any> {
        if (!this.provider) {
            throw new Error("Provider not initialized");
        }
        return await this.provider.SendAlert(data);
    }
}