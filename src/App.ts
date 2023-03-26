import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { Connection } from "./database/Connection";
import Utils from "./utils/Utils";
import { PingRouter } from "./routes/PingRouter";

class App {
  private app: Express;
  private serverConfig: any;
  private conn!: Connection;

  constructor(config: any) {
    this.app = express();
    this.serverConfig = config;

    this.InitApp();
  }

  public getApp(): Express {
    return this.app;
  }

  private InitApp(): void {
    try {
      this.app.set("port", process.env.PORT || this.serverConfig.SERVER_PORT);
      this.app.set("env", process.env.NODE_ENV || this.serverConfig.ENVIROMENT);
      if (this.serverConfig.ENVIROMENT === Utils.Enviroment.DEVELOP) {
        this.InitDevDependencies();
        this.InitProdDependencies();
        this.conn = Connection.getConnection(this.serverConfig.DATABASE.DEV.PARAMS);
      } else {
        this.InitProdDependencies();
        this.conn = Connection.getConnection(this.serverConfig.DATABASE.PROD.PARAMS);
      }
      this.app.set("connection", this.conn);
      this.InitAppRoutes();
    } catch (error) {
      throw error;
    }
  }

  private InitDevDependencies(): void {
    this.app.use(morgan("dev"));
  }

  private InitProdDependencies(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false })); 
    this.app.use(cors(this.serverConfig.application.cors.server));
    this.app.use((_req: Request, res: Response, next: NextFunction) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Content-Disposition, Accept, Access-Control-Allow-Request-Method');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
      res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
      next();
    });
  }

  private InitAppRoutes(): void {
    this.app.use(
      `${this.serverConfig.BASE_URL}`,
      new PingRouter().getRouter()
    );
  }

  public Listen(): void {
    this.app.listen(this.app.get("port"));
    console.log(`Server on port ${this.app.get("port")}`);
  }
}

export default App;
