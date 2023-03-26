import { Router } from "express";
import { IRouter } from "../interfaces/IRouter";
import { PingServices } from "../services/PingServices";

export class PingRouter implements IRouter{
    router: Router;
    PingServices: PingServices;

    constructor() {
        this.router = Router();
        this.PingServices = new PingServices();
        this.RegisterRoutes();
    }

    getRouter(): Router {
        return this.router;
    }
    RegisterRoutes(): void {
        this.Ping();
    }

    private Ping(): void {
        this.router
            .route("/ping")
            .get(this.PingServices.Ping.bind(this.PingServices));
    }

}