import { Redis } from "../datastore/redis";
import { ChatQueue } from "../queues/chat";
import { AppRepository } from "../repositories/app";
import { ChatRepository } from "../repositories/chat";
import { ResourceNotFoundError } from "../errors/error";
import { ChatResponseDTO } from "../DTOs/chat";
import { formatAppRedisKey, formatChatRedisKey } from "../utils";

export class ChatService {
    private redis: Redis
    private queue: ChatQueue
    private appRepository: AppRepository
    private chatRepository: ChatRepository

    constructor(redis: Redis, chatQueue: ChatQueue, appRepository: AppRepository, chatRepository: ChatRepository) {
        this.redis = redis
        this.queue = chatQueue
        this.appRepository = appRepository
        this.chatRepository = chatRepository
    }

    public async create(token: string) {
        try {
            const app = await this.appRepository.getByToken(token)
            if (app === null) {
                console.log('in if check service')
                throw new ResourceNotFoundError('Invalid app token!', null)
            }
            const appId = app.getId()!
                const key = formatAppRedisKey(token)
                const chatNumber = await this.redis.incr(key)
                await this.queue.create(appId, chatNumber)
                const chatKey = formatChatRedisKey(token, chatNumber)
                await this.redis.set(chatKey, 0)
                return chatNumber
        } catch (error: any) {
            // if it's the custom error throw it 
            if(error instanceof ResourceNotFoundError) {
                throw error
            }

            throw new Error('Unexpected error occured', error)
        }
    }

    public async getChatsByAppToken(token: string) {
        try {
            const app = await this.appRepository.getByToken(token)
            if (app === null) {
                throw new ResourceNotFoundError('Invalid app token!', null)
            }
            const appId = app.getId()!
                const chats = await this.chatRepository.getChatsByAppToken(appId)
                return chats.map((chat) => new ChatResponseDTO(chat))
        } catch (error: any) {
            if(error instanceof ResourceNotFoundError) {
                throw error
            } else {
                throw new Error('Unexpected error occured', error)
            }
        }
    }

    public async delete(token: string, chatNumber: number) {
        try {
            const app = await this.appRepository.getByToken(token)
            if(app === null) {
                throw new ResourceNotFoundError('Invalid app token!')
            }
            const appId = app.getId()!
                await this.queue.delete(appId, chatNumber)
                const chatRedisKey = formatChatRedisKey(token, chatNumber)
                await this.redis.del(chatRedisKey)
        } catch (error: any) {
            if(error instanceof ResourceNotFoundError) {
                throw error
            } else {
                console.log(error)
                throw new Error('Unexpected error occured', error)
            }
        }
    }
}