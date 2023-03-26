import { Response, Request } from "express";
import { PingController } from "../controllers/PingController";
import { IService } from "../interfaces/IService";
import Utils from "../utils/Utils";

export class PingServices implements IService {

    controller!: PingController;

    constructor() {

    }

    public Ping(req: Request, res: Response): void {
        this.controller = new PingController(req);
        res.status(Utils.HTTPStatus.OK).json(this.controller.Ping());
    }
}