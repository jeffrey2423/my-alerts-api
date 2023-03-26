export interface IQueryResult {
    status: boolean;
    data: QueryResult<any>;
    message: string;
    error: any;
}

export interface IServiceResponse implements IQueryResult {
    httpStatus: number;
};

export enum AlertsProviders {
    Whatsapp = "whatsapp",
    Telegram = "telegram",
    NodeMailer = "nodemailer",
    Twilio = "twilio",
    Nexmo = "nexmo"
}