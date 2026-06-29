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
                res.status(404).json({error: error.message})
            } else {
                res.status(500).json({error: 'Internal server error'})
            }
        }
    }

    public async getChatsByappToken(req: Request, res: Response) {
        const token = req.params.token as string
        if(!token) {
            res.status(400).json({message: 'Missing required path params!'})
            return
        }
        try {
            const chats = await this.chatService.getChatsByAppToken(token)
            res.status(200).json(chats)
        } catch (error) {
            if(error instanceof ResourceNotFoundError) {
                console.log(error.message)
                res.status(404).json({error: error.message})
            } else {
                res.status(500).json({error: 'Internal server error'})
            }
        }
    }

    public async delete(req: Request, res: Response) {
        const token = req.params.token as string
        const number = req.params.number as string
        if(!token || !number) {
            res.status(400).json({message: 'missing required path params!'})
            return
        }
        try {
            const chatNumber = Number(number)
            await this.chatService.delete(token, chatNumber)
            res.status(204)
            res.end()
        } catch (error) {
            if(error instanceof ResourceNotFoundError) {
                res.status(404).json({error: error.message})
            } else {
                res.status(500).json({error: 'Internal server error!'})
            }
        }
    }
}