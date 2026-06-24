export class AppModel {
    private id?: number
    private token: string
    private name: string
    private chatsCount: number
    private createdAt?: Date

    constructor(token: string, name: string, chatsCount = 0, id?: number, createdAt?: Date) {
        this.token = token
        this.name = name
        this.chatsCount = chatsCount
        this.id = id
        this.createdAt = createdAt
    }

    public getToken() {
        return this.token
    }
    public getName() {
        return this.name
    }
    public getChatsCount() {
        return this.chatsCount
    }
    public getId(): number | undefined {
        return this.id
    }
    public getCreatedAt(): Date | undefined {
        return this.createdAt
    }
}