import { Pool, QueryResult } from "pg";
import dotenv from 'dotenv'

dotenv.config()
const connectionString = process.env.POSTGRES_CONNECTION_STRING
export class Postgres {
    private pool: Pool

    constructor() {
        this.pool = new Pool({
            connectionString,
            max: 20
        })
        this.pool.on('error', (error) => {
            console.error('Postgres error: ', error)
        })
    }
    public async query(query: string, params?: any[]): Promise<QueryResult> {
        return this.pool.query(query, params)
    }
}