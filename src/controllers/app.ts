import { Request, Response } from "express"
import { AppResponseDto } from "../DTOs/app"
import { AppService } from "../services/app"
import { DuplicateResourceError } from "../errors/error"
export class AppController {
    private appService: AppService

    constructor(appService: AppService) {
        this.appService = appService
    }

    public async create(req: Request, res: Response) {
        try {
            const name = req.body.name
            if(!name) {
                res.status(400).send('Missing required body fields!')
                return
            }
            const newApp = await this.appService.create(name)
            if(!newApp) {
                res.status(404).send('Not Found!')
                return
            }
    
            res.status(201).json(new AppResponseDto(newApp))
        } catch (error) {
            if(error instanceof DuplicateResourceError) {
                res.status(409).json({error: error.message})
                return
            }
            console.error('Unhandled exception', error)
            res.status(500).json({error: 'Internal server error!'})
        }
    }
}