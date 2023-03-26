import { Router } from "express";

export interface IRouter {
    router: Router;
    getRouter(): Router;
    RegisterRoutes(): void;
}