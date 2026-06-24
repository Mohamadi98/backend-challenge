import { AppModel } from "../models/app";
import { AppRepository } from "../repositories/app";

export class AppService {
    private appRepository: AppRepository

    constructor(appRepository: AppRepository) {
        this.appRepository = appRepository
    }

    public async create(name: string): Promise<AppModel | null> {
        const token = crypto.randomUUID()
        const app = new AppModel(token, name)
        return await this.appRepository.create(app)
    }

    public async getByToken(token: string) {
        return await this.appRepository.getByToken(token)
    }

    public async deleteByToken(token: string) {
        return await this.appRepository.deleteByToken(token)
    }
}