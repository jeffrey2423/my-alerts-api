import { Request } from "express";
import { Connection } from "../database/Connection";
import { ExecuteCommand } from "../database/ExecuteCommand";
import { IController } from "../interfaces/IController";

export class PingController implements IController{   
    req: Request;
    conn: Connection;
    command: ExecuteCommand;

    constructor(req: Request) {
        this.req = req;
        this.conn = req.app.get("connection");
        this.command = req.app.get("command");

        this.command = new ExecuteCommand(this.conn);
    }

    public Ping(): string{
        return "Pong";
    }
}