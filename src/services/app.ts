import { DatabaseError, DuplicateResourceError } from "../errors/error";
import { AppModel } from "../models/app";
import { AppRepository } from "../repositories/app";
import { Redis } from "../datastore/redis";

export class AppService {
    private appRepository: AppRepository
    private redis: Redis

    constructor(appRepository: AppRepository, redis: Redis) {
        this.appRepository = appRepository
        this.redis = redis
    }

    public async create(name: string): Promise<AppModel> {
        const token = crypto.randomUUID()
        const app = new AppModel(token, name)
        try {
            const key = `app:${token}:chat:number`
            await this.redis.set(key, 0)
            return await this.appRepository.create(app)
        } catch (error: any) {
            if(error.code === '23505') {
                throw new DuplicateResourceError('Duplicate token entry', error)
            } else {
                throw new DatabaseError('Unexpected Datbase error', error)
            }
        }
    }

    public async getByToken(token: string) {
        try {
            return await this.appRepository.getByToken(token)
        } catch (error) {
            throw new DatabaseError('unexpected Database error', error)
        }
    }

    public async deleteByToken(token: string) {
        try {
            return await this.appRepository.deleteByToken(token)
        } catch (error) {
            throw new DatabaseError('unexpected Database error', error)
        }
    }
}