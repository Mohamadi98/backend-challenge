import { Worker } from "bullmq";
import { Postgres } from "../datastore/postgres";
import { QueueEnum } from "../enums";
import { ChatRepository } from "../repositories/chat";

export function InitializeChatWorker(chatRepository: ChatRepository) {
    const chatWorker = new Worker(QueueEnum.CHAT_QUEUE_NAME, async (job) => {
        switch (job.name) {
            case QueueEnum.CHAT_JOB_CREATE: {
                console.log(`[WORKER] executing job id:${job.id} of name:${job.name}`)
                break;
            }
            
            case QueueEnum.CHAT_JOB_DELETE: {
                console.log(`[WORKER] executing job id:${job.id} of name:${job.name}`)
                break;
            }
            default:
                break;
        }
    })
}