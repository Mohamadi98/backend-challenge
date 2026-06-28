import { Queue } from "bullmq";
import { QueueEnum } from "../enums";

export class ChatQueue {
    private queue: Queue

    constructor(redis: any) {
        this.queue = new Queue(QueueEnum.CHAT_QUEUE_NAME, { connection: redis })
    }

    public async create(appId: number, chatNumber: number) {
        await this.queue.add(QueueEnum.CHAT_JOB_CREATE, { appId, chatNumber }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            },
            removeOnComplete: true,
            removeOnFail: {
                age: 24 * 3600 ,// keep the failed job in redis for 24 hours
                count: 100 // keep at most 100 failed job in redis 
            }
        })
    }
    public async delete(chatId: number) {
        await this.queue.add(QueueEnum.CHAT_JOB_DELETE, { chatId }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            },
            removeOnComplete: true,
            removeOnFail: {
                age: 24 * 3600 ,// keep the failed job in redis for 24 hours
                count: 100 // keep at most 100 failed job in redis 
            }
        })
    }
}