import App from "./App";
import serverConfig from "./config/config.json";
import { Connection } from "./database/Connection";
import { ExecuteCommand } from "./database/ExecuteCommand";

class Index {
    private application: App;
    private connection!: Connection;
    private executeCommand!: ExecuteCommand;

    constructor() {
        this.application = new App(serverConfig);
    }

    public async Main(): Promise<void> {
        try {
            this.application.Listen();
            this.connection = this.application.getApp().get('connection');
            await this.connection.TestConnection();
            
            this.executeCommand = new ExecuteCommand(this.connection);
            this.application.getApp().set('command', this.executeCommand);
        } catch (error) {
            throw error;
        }
    }
};

const index: Index = new Index();
index.Main();