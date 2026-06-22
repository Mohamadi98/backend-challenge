import { createClient, RedisClientType } from "redis";
import dotenv from 'dotenv'

dotenv.config()
const connectionString = process.env.REDIS_CONNECTION_STRING
console.log(connectionString)

export class Redis {
    private client: RedisClientType

    constructor() {
        this.client = createClient({
            url: connectionString
        })
        this.client.on('connect', () => {
            console.log('Initiating redis connection!')
        })
        this.client.on('ready', () => {
            console.log('Redis connected and ready to use!')
        })
        this.client.on('error', (err) => {
            console.error('Error connecting to redis server:', err)
        })
    }

    public async connect() {
        await this.client.connect()
    }
    public getClient(): RedisClientType {
        return this.client
    }
    public async disconnect() {
        await this.client.quit()
    }
}