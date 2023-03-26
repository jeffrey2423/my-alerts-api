import { Request } from "express";
import { Connection } from "../database/Connection";
import { ExecuteCommand } from "../database/ExecuteCommand";

export interface IController {
    req: Request;
    conn: Connection;
    command: ExecuteCommand
}