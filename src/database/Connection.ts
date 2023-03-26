import { Pool, PoolClient } from "pg";

export class Connection {
    private static instance: Connection;
    private bdParams: any;
    private connectionPool: Pool;

    private constructor(bdParams: any) {
        this.bdParams = bdParams;
        this.connectionPool = this.InitConnection();
    }

    public static getConnection(bdParams: any): Connection {
        if (!Connection.instance) {
            Connection.instance = new Connection(bdParams);
        }

        return Connection.instance;
    }

    public getConnectionPool(): Pool {
        return this.connectionPool;
    }

    private InitConnection(): Pool {
        try {
            return new Pool(this.bdParams);
        } catch (error) {
            throw error;
        }
    }

    public async TestConnection(): Promise<void> {
        try {
            const client: PoolClient = await this.connectionPool.connect();
            console.log("Connection to database was successful");
            client.release();
        } catch (error) {
            throw error;
        }
    }
}