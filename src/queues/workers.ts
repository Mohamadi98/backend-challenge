import { Worker } from "bullmq";
import { QueueEnum } from "../enums";
import { ChatRepository } from "../repositories/chat";
import { ChatModel } from "../models/chat";

export function InitializeChatWorker(chatRepository: ChatRepository, redis: any) {
    const chatWorker = new Worker(QueueEnum.CHAT_QUEUE_NAME, async (job) => {
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