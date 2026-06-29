import { Redis } from "../datastore/redis"
import { ResourceNotFoundError } from "../errors/error"
import { MessageQueue } from "../queues/message"
import { AppRepository } from "../repositories/app"
import { ChatRepository } from "../repositories/chat"

export class MessageService {
    private redis: Redis
    private chatRepository: ChatRepository
    private messageQueue: MessageQueue
    private appRepository: AppRepository

    constructor(redis: Redis, chatRepository: ChatRepository, messageQueue: MessageQueue, appRepository: AppRepository) {
        this.redis = redis
        this.chatRepository = chatRepository
        this.messageQueue = messageQueue
        this.appRepository = appRepository
    }

    public async create(token: string, chatNumber: number, body: string) {
        try {
            const app = await this.appRepository.getByToken(token)
            if(app === null) {
                throw new ResourceNotFoundError('Invalid app token!')
            }
            const appId = app.getId()
            if(appId) {
                const chat = await this.chatRepository.getChatByNumber(appId, chatNumber)
                if(chat === null) {
                    throw new ResourceNotFoundError('Chat with this number not found')
                }
                const chatId = chat.getId()
                if(chatId) {
                    const chatKey = `${token}:chat:${chatNumber}:msg:number`
                    const msgNumber = await this.redis.incr(chatKey)
                    await this.messageQueue.create(chatId, body, msgNumber)
                    return {body: body, number: msgNumber}
                } else {
                    return null
                }
            } else {
                return null
            }
        } catch (error) {
            if(error instanceof ResourceNotFoundError) {
                throw error
            }
        }
    }
}