export class ChatModel {
    private id?: number
    private appId: number
    private number: number
    private messagesCounts: number
    private createdAt?: Date

    constructor(appId: number, number: number, messagesCount = 0, id?:number, createdAt?: Date) {
        this.id = id
        this.appId = appId
        this.number = number
        this.messagesCounts = messagesCount
        this.createdAt = createdAt
    }

    public getId() {
        return this.id
    }
    public getAppId() {
        return this.appId
    }
    public getNumber() {
        return this.number
    }
    public getMessagesCount() {
        return this.messagesCounts
    }
    public getCreatedAt() {
        return this.createdAt
    }
}