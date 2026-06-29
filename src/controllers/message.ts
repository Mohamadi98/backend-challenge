import { Request, Response } from "express";
import { MessageService } from "../services/message";
import { ResourceNotFoundError } from "../errors/error";

export class MessageController {
    private messageService: MessageService

    constructor(messageService: MessageService) {
        this.messageService = messageService
    }

    public async create(req: Request, res: Response) {
        const {token, chatNumber, body} = req.body
        if(!token || !chatNumber || !body) {
            res.status(400).json({message: 'Missing required data!'})
            return
        }
        try {
            const newMessage = await this.messageService.create(token, chatNumber, body)
            return res.status(201).json(newMessage)
        } catch (error) {
            if(error instanceof ResourceNotFoundError) {
                res.status(404).json({error: error.message})
            } else [
                res.status(500).json({error: 'Internal server error!'})
            ]
        }
    }
}