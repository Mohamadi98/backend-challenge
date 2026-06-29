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

    public async getId() {
        return this.id
    }
    public async getChatId() {
        return this.chatId
    }
    public async getNumber() {
        return this.number
    }
    public async getBody() {
        return this.body
    }
    public async getCeatedAt() {
        return this.createdAt
    }
}