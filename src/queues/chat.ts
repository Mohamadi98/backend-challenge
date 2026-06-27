import { Queue } from "bullmq";
import { QueueEnum } from "../enums";

export class ChatQueue {
    private queue: Queue

    constructor(redis: any) {
        this.queue = new Queue(QueueEnum.CHAT_QUEUE_NAME, {connection: redis})
    }

    public async create(appToken: string, chatNumber: number) {
        await this.queue.add(QueueEnum.CHAT_JOB_CREATE, {appToken, chatNumber})
    }
    public async delete(chatId: number) {
        await this.queue.add(QueueEnum.CHAT_JOB_DELETE, {chatId})
    }
}