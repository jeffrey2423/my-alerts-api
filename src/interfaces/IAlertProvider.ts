import {Axios} from "axios";

export interface IAlertProvider {
    axios?: Axios;
    InitProvider(data: any): void;
    SendAlert(data: any): Promise<any>;
}