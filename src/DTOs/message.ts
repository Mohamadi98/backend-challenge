import { MessageModel } from "../models/message";

export class MessageresponseDTO {
    private number: number
    private body: string

    constructor(message: MessageModel) {
        this.number = message.getNumber()
        this.body = message.getBody()
    }
}