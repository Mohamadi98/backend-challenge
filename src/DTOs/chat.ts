import { ChatModel } from "../models/chat"

export class ChatResponseDTO {
    private number: number
    private messagesCount: number

    constructor(chat: ChatModel) {
        this.number = chat.getNumber()
        this.messagesCount = chat.getMessagesCount()
    }
}