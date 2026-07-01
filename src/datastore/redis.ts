import { createClient, RedisClientType } from "redis";
import dotenv from 'dotenv'

dotenv.config()
const connectionString = process.env.REDIS_CONNECTION_STRING

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
    public async set(key: string, value: any) {
        return await this.client.set(key, value)
    }
    public async get(key: string) {
        return await this.client.get(key)
    }
    public async incr(key: string) {
        return await this.client.INCR(key)
    }
    public async decr(key: string) {
        return await this.client.DECR(key)
    }
    public async del(key: string) {
        await this.client.del(key)
    }
    public async patternDelete(pattern: string) {
        let cursor = '0'
        let scanResult
        do {
            scanResult = await this.client.SCAN(cursor, {MATCH: pattern, COUNT: 100})
            if(scanResult.keys.length > 0) {
                await this.client.del(scanResult.keys)
            }
        } while (cursor !== '0');
    }
}