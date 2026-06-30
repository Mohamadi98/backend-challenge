export class MessageModel {
    private id?: number
    private chatId: number
    private number: number
    private body: string
    private createdAt?: Date

    constructor(chatId: number, number: number, body: string, id?: number, createdAt?: Date) {
        this.number = number
        this.body = body
        this.id = id
        this.chatId = chatId
        this.createdAt = createdAt
    }

    public getId() {
        return this.id
    }
    public getChatId() {
        return this.chatId
    }
    public getNumber() {
        return this.number
    }
    public getBody() {
        return this.body
    }
    public getCeatedAt() {
        return this.createdAt
    }
}