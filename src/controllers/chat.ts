import { Request, Response } from "express"
import { ChatService } from "../services/chat"
import { ResourceNotFoundError } from "../errors/error"

export class ChatController {
    private chatService: ChatService

    constructor(chatService: ChatService) {
        this.chatService = chatService
    }

    public async create(req: Request, res: Response) {
        const token = req.body.token
        if(!token) {
            res.status(400).json({message: 'Missing required path params!'})
            return
        }
        try {
            const newChatNumber = await this.chatService.create(token)
            res.status(201).json({newChatNumber})
        } catch (error) {
            if(error instanceof ResourceNotFoundError) {
                console.log('in if check for error')
                res.status(404).json({error: error.message})
            } else {
                res.status(500).json({error: 'Internal server error'})
            }
        }
    }
}