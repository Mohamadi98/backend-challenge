import { AppModel } from "../models/app";

export class AppResponseDto {
    public token: string
    public name: string
    public chatsCount: number

    constructor(app: AppModel) {
        this.token = app.getToken()
        this.name = app.getName()
        this.chatsCount = app.getChatsCount()
    }
}