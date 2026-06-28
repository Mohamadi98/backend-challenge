import { Redis } from "../datastore/redis";
import { ChatQueue } from "../queues/chat";
import { AppRepository } from "../repositories/app";
import { ResourceNotFoundError } from "../errors/error";

export class ChatService {
    private redis: Redis
    private queue: ChatQueue
    private appRepository: AppRepository

    constructor(redis: Redis, chatQueue: ChatQueue, appRepository: AppRepository) {
        this.redis = redis
        this.queue = chatQueue
        this.appRepository = appRepository
    }

    public async create(token: string) {
        try {
            const app = await this.appRepository.getByToken(token)
            if (app === null) {
                console.log('in if check service')
                throw new ResourceNotFoundError('Invalid app token!', null)
            }
            const appId = app.getId()
            if (appId) {
                const key = `app:${token}:chat:number`
                const chatNumber = await this.redis.incr(key)
                await this.queue.create(appId, chatNumber)
                return chatNumber
            } else {
                return null
            }
        } catch (error: any) {
            // if it's the custom error throw it 
            if(error instanceof ResourceNotFoundError) {
                throw error
            }

            throw new Error('Unexpected error occured', error)
        }
    }
}