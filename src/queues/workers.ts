import { Worker } from "bullmq";
import { QueueEnum } from "../enums";
import { ChatRepository } from "../repositories/chat";
import { ChatModel } from "../models/chat";
import { MessageModel } from "../models/message";
import { MessageRepository } from "../repositories/message";

export function InitializeChatWorker(chatRepository: ChatRepository, redis: any) {
    new Worker(QueueEnum.CHAT_QUEUE_NAME, async (job) => {
        switch (job.name) {
            case QueueEnum.CHAT_JOB_CREATE: {
                console.log(`[WORKER] executing job id:${job.id} of name:${job.name}`)
                const chat = new ChatModel(job.data.appId, job.data.chatNumber)
                const newChat = await chatRepository.create(chat)
                console.log('New chat created', newChat)
                break;
            }
            
            case QueueEnum.CHAT_JOB_DELETE: {
                console.log(`[WORKER] executing job id:${job.id} of name:${job.name}`)
                await chatRepository.delete(job.data.appId, job.data.chatNumber)
                console.log(`chat with appId: ${job.data.appId} and number: ${job.data.chatNumber} deleted successfuly!`)
                break;
            }

            default:
                break;
        }
    }, {connection: redis})
}

export function InitializeMessageWorker(redis: any, messageRepository: MessageRepository) {
    new Worker(QueueEnum.MESSAGE_QUEUE_NAME, async (job) => {
        switch(job.name) {
            case QueueEnum.MESSAGE_JOB_CREATE: {
                console.log(`[WORKER] executing job id:${job.id} of name:${job.name}`)
                const message = new MessageModel(job.data.chatId, job.data.number, job.data.body)
                const newMessage = await messageRepository.create(message)
                console.log('New message created', newMessage)
                break;
            }

            case QueueEnum.MESSAGE_JOB_DELETE: {
                console.log(`[WORKER] executing job id:${job.id} of name:${job.name}`)
                break;
            }

            default:
                break;
        }
    }, {connection: redis})
}