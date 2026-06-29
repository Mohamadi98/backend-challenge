import { Queue } from "bullmq";
import { QueueEnum } from "../enums";

export class MessageQueue {
    private queue: Queue

    constructor(redis: any) {
        this.queue = new Queue(QueueEnum.MESSAGE_QUEUE_NAME, {connection: redis})
    }

    public async create(chatId: number, body: string, number: number) {
        await this.queue.add(QueueEnum.MESSAGE_JOB_CREATE, {chatId, body, number}, 
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000
                },
                removeOnComplete: true,
                removeOnFail: {
                    age: 24 * 3600,
                    count: 100
                }
            }
        )
    }

    public async delete(chatId: number, number: number) {
        await this.queue.add(QueueEnum.MESSAGE_JOB_DELETE, {chatId, number}, 
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000
                },
                removeOnComplete: true,
                removeOnFail: {
                    age: 24 * 3600,
                    count: 100
                }
            }
        )
    } 
}