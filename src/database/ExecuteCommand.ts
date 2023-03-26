import { PoolClient, QueryResult } from "pg";
import { IQueryResult } from "../types";
import { Connection } from "./Connection";

export class ExecuteCommand {
    private conn: Connection;

    public constructor(conn: Connection) {
        this.conn = conn;
    }

    public async ExecuteQuery(query: string, params: any[]): Promise<IQueryResult> {
        let data: IQueryResult;
        try {
            const client: PoolClient = await this.conn.getConnectionPool().connect();
            const result: QueryResult<any> = await client.query(query, params);
            client.release();
            data = this.GenerateReturnData(null, result);
        } catch (ex: any) {
            data = this.GenerateReturnData(ex, null);
        }
        return data;
    }

    public ExecuteQueryCallBack(query: string, params: any[], callback: Function): void {
        let data: IQueryResult;
        this.conn.getConnectionPool().connect((err: Error, client: PoolClient, done: Function) => {
            if (err) {
                data = this.GenerateReturnData(err, null);
                done();
                callback(data);
                return;
            }
            client.query(query, params, (err: Error, result: QueryResult<any>) => {
                if (err) {
                    data = this.GenerateReturnData(err, null);
                    done();
                    callback(data);
                    return;
                }

                data = this.GenerateReturnData(null, result);
                done();
                callback(data);
            });
        });
    }

    public async ExecuteQueryWithTransaction(query: string, params: any[]): Promise<IQueryResult> {
        let data: IQueryResult;
        let client!: PoolClient;
        try {
            client = await this.conn.getConnectionPool().connect();
            await client.query("BEGIN");
            const result: QueryResult<any> = await client.query(query, params);
            await client.query("COMMIT");
            client.release();

            data = this.GenerateReturnData(null, result);
        } catch (ex) {
            data = this.GenerateReturnData(ex, null);
            await client.query("ROLLBACK");
        }
        return data;
    }

    public ExecuteQueryWithTransactionCallBack(query: string, params: any[], callback: Function): void {
        let data: IQueryResult;
        this.conn.getConnectionPool().connect((err: Error, client: PoolClient, done: Function) => {
            if (err) {
                data = this.GenerateReturnData(err, null);
                done();
                callback(data);
                return;
            };
            client.query("BEGIN", (err: Error) => {
                if (err) {
                    data = this.GenerateReturnData(err, null);
                    done();
                    callback(data);
                    return;
                }
                client.query(query, params, (err: Error, result: QueryResult<any>) => {
                    if (err) {
                        data = this.GenerateReturnData(err, null);
                        done();
                        callback(data);
                        return;
                    }
                    client.query("COMMIT", (err: Error) => {
                        if (err) {
                            data = this.GenerateReturnData(err, null);
                            done();
                            callback(data);
                            return;
                        }

                        data = this.GenerateReturnData(null, result);
                        done();
                        callback(data);
                    });
                });
            });
        });
    }

    private GenerateReturnData(error?: any, queryResult?: any): IQueryResult {
        let data: IQueryResult;
        if (error != null && error != undefined) {
            data = {
                status: false,
                data: null,
                message: "error",
                error: error
            };
        } else {
            data = {
                status: true,
                data: queryResult,
                message: "success",
                error: null
            };
        }
        return data;
    }
}