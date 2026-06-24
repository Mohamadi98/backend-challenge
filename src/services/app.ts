import { AppModel } from "../models/app";
import { AppRepository } from "../repositories/app";

export class AppService {
    private appRepository: AppRepository

    constructor(appRepository: AppRepository) {
        this.appRepository = appRepository
    }

    public async create(name: string): Promise<AppModel | null> {
        // const token = crypto.randomUUID()
        const token = 'bdabc22b-6cf0-4b19-8da1-98dc34f4a9cf'
        const app = new AppModel(token, name)
        return await this.appRepository.create(app)
    }
}