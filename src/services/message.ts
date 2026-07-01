import { Redis } from "../datastore/redis"
import { MessageresponseDTO } from "../DTOs/message"
import { ResourceNotFoundError } from "../errors/error"
import { MessageQueue } from "../queues/message"
import { AppRepository } from "../repositories/app"
import { ChatRepository } from "../repositories/chat"
import { MessageRepository } from "../repositories/message"
import { formatChatRedisKey } from "../utils"

export class MessageService {
    private redis: Redis
    private chatRepository: ChatRepository
    private messageRepository: MessageRepository
    private messageQueue: MessageQueue
    private appRepository: AppRepository

    constructor(
        redis: Redis, chatRepository: ChatRepository, messageQueue: MessageQueue, appRepository: AppRepository, messageRepositoy: MessageRepository) {
        this.redis = redis
        this.chatRepository = chatRepository
        this.messageQueue = messageQueue
        this.appRepository = appRepository
        this.messageRepository = messageRepositoy
    }

    public async create(token: string, chatNumber: number, body: string) {
        try {
            const app = await this.appRepository.getByToken(token)
            if (app === null) {
                throw new ResourceNotFoundError('Invalid app token!')
            }
            const appId = app.getId()!
            const chat = await this.chatRepository.getChatByNumber(appId, chatNumber)
            if (chat === null) {
                throw new ResourceNotFoundError('Chat with this number not found')
            }
            const chatId = chat.getId()!
            const chatKey = formatChatRedisKey(token, chatNumber)
            const msgNumber = await this.redis.incr(chatKey)
            await this.messageQueue.create(chatId, body, msgNumber)
            return { body: body, number: msgNumber }
        } catch (error: any) {
            console.log(error)
            if (error instanceof ResourceNotFoundError) {
                throw error
            } else {
                console.log(error)
                throw new Error('Unexpected error occured', error)
            }
        }
    }

    public async getMessages(token: string, chatNumber: number) {
        try {
            const app = await this.appRepository.getByToken(token)
            if(app === null) {
                throw new ResourceNotFoundError('Invalid app token!')
            }
            const appId = app.getId()!
            const chat = await this.chatRepository.getChatByNumber(appId, chatNumber)
            if(chat === null) {
                throw new ResourceNotFoundError('Chat with this number not found!')
            }
            const chatId = chat.getId()!
            const messages = await this.messageRepository.getMessages(chatId)
            return messages.map((message) => new MessageresponseDTO(message))
        } catch (error: any) {
            console.log(error)
            if(error instanceof ResourceNotFoundError) {
                throw error
            } else {
                throw new Error('Unexpected error occured', error)
            }
        }
    }

    public async getMessage(token: string, chatNumber: number, msgNumber: number) {
        try {
            const app = await this.appRepository.getByToken(token)
            if(app === null) {
                throw new ResourceNotFoundError('Invalid app token!')
            }
            const appId = app.getId()!
            const chat = await this.chatRepository.getChatByNumber(appId, chatNumber)
            if(chat === null) {
                throw new ResourceNotFoundError('Chat with this number not found!')
            }
            const chatId = chat.getId()!
            return await this.messageRepository.getMessage(chatId, msgNumber)
        } catch (error: any) {
            console.log(error)
            if(error instanceof ResourceNotFoundError) {
                throw error
            } else {
                throw new Error('Unexpected error occured', error)
            }
        }
    }

    public async delete(token: string, chatNumber: number, msgNumber: number) {
        try {
            const app = await this.appRepository.getByToken(token)
            if(app === null) {
                throw new ResourceNotFoundError('Invalid app token!')
            }
            const appId = app.getId()!
            const chat = await this.chatRepository.getChatByNumber(appId, chatNumber)
            if(chat === null) {
                throw new ResourceNotFoundError('Chat with this number not found!')
            }
            const chatId = chat.getId()!
            await this.messageQueue.delete(chatId, msgNumber)
        } catch (error: any) {
            console.log(error)
            if(error instanceof ResourceNotFoundError) {
                throw error
            } else {
                throw new Error('Unexpected error occured', error)
            }
        }
    }
}