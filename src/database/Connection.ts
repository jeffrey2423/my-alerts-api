import { Pool, PoolClient, QueryResult } from "pg";
import {IQueryResult} from '../utils/QueryResult'
import Utils from "../utils/Utils";
import serverConfig from '../config/config.json';
import serverMessages from '../serverMessages.json'

export class Connection {
    private static instance: Connection;
    private static bdParams: any;
    private connectionPool!: Pool;

    private constructor(bdParams: any) {
        Connection.bdParams = bdParams;
    }

    public static getConnection(): Connection {

        if (serverConfig.ENVIROMENT === Utils.Enviroment.DEVELOP) {
            Connection.bdParams = serverConfig.DATABASE.DEV.PARAMS;
        } else {
            Connection.bdParams = serverConfig.DATABASE.PROD.PARAMS;
        }

        if (!Connection.instance) {
            Connection.instance = new Connection(Connection.bdParams);
        }

        return Connection.instance;
    }

    public getConnectionPool(): Pool {
        this.InitConnection();
        return this.connectionPool;
    }

    private InitConnection(): void {
        try {
            this.connectionPool = new Pool(Connection.bdParams);
        } catch (error) {
            throw error;
        }
    }

    public async TestConnection(): Promise<void> {
        let client!: PoolClient;
        try {
            client = await this.connectionPool.connect();
        } catch (error) {
            throw error;
        } finally {
            client?.release();
        }
    }

    public async ExecuteQuery(query: string, params: any[] = []): Promise<IQueryResult> {
        let data: IQueryResult;
        let client!: PoolClient;
        try {
            client = await this.connectionPool.connect();
            const result: QueryResult<any> = await client.query(query, params);

            data = Utils.GenerateReturnData(null, serverMessages.DATABASE.ERROR, result.rows);
        } catch (ex: any) {
            data = Utils.GenerateReturnData(ex, serverMessages.DATABASE.ERROR, null);
        } finally {
            client?.release();
        }
        return data;
    }

    public async ExecuteQueryWithTransaction(query: string, params: any[] = []): Promise<IQueryResult> {
        let data: IQueryResult;
        let client!: PoolClient;
        try {
            client = await this.connectionPool.connect();
            await client.query("BEGIN");
            const result: QueryResult<any> = await client.query(query, params);
            await client.query("COMMIT");

            data = Utils.GenerateReturnData(null, serverMessages.DATABASE.ERROR, result.rows);
        } catch (ex) {
            data = Utils.GenerateReturnData(ex, serverMessages.DATABASE.ERROR, null);
            await client.query("ROLLBACK");
        } finally {
            client?.release();
        }
        return data;
    }
}
