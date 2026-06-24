import { Request, Response } from 'express'
import { AppResponseDto } from "../DTOs/app"
import { AppService } from "../services/app"
import { DatabaseError, DuplicateResourceError } from "../errors/error"
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
                console.log(error.message)
                console.error(error.cause)
                res.status(409).json({error: error.message})
                return
            }
            if(error instanceof DatabaseError) {
                console.log(error.message)
                console.error(error.cause)
            }
            res.status(500).json({error: 'Internal server error!'})
        }
    }

    public async getByToken(req: Request, res: Response) {
        try {
            const token = req.params.token as string
            if(!token) {
                res.status(400).json({message: 'missing required path params!'})
                return
            }
            const app = await this.appService.getByToken(token)
            if(!app) {
                res.status(404).json({message: 'NOT FOUND'})
                return
            }
    
            res.status(200).json(new AppResponseDto(app))
        } catch (error) {
            if(error instanceof DatabaseError) {
                console.log(error.message)
                console.error(error.cause)
            }
            res.status(500).json({error: 'Internal server error!'})
        }
    }

    public async deleteByToken(req: Request, res: Response) {
        try {
            const token = req.params.token as string
            if(!token) {
                res.status(400).json({message: 'Required missing path params!'})
                return
            }
            await this.appService.deleteByToken(token)
            res.status(204)
            res.end()
        } catch (error) {
            if(error instanceof DatabaseError) {
                console.log(error.message)
                console.error(error.cause)
            }
            res.status(500).json({message: 'Internal server error!'})
        }
    }
}