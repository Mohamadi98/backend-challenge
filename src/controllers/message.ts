import { Request, Response } from "express";
import { MessageService } from "../services/message";
import { ResourceNotFoundError } from "../errors/error";
import { MessageresponseDTO } from "../DTOs/message";

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
            res.status(201).json(newMessage)
        } catch (error) {
            if(error instanceof ResourceNotFoundError) {
                res.status(404).json({error: error.message})
            } else [
                res.status(500).json({error: 'Internal server error!'})
            ]
        }
    }

    public async getMessages(req: Request, res: Response) {
        try {
            const token = req.params.token as string
            const number = req.params.number as string
            if(!token || !number) {
                res.status(400).json({message: 'Missing required path params!'})
                return
            }
            const chatNumber = Number(number)
            const messages = await this.messageService.getMessages(token, chatNumber)
            res.status(200).json(messages)
        } catch (error) {
            if(error instanceof ResourceNotFoundError) {
                res.status(404).json({error: error.message})
            } else {
                res.status(500).json({error: 'Internal server error!'})
            }
        }
    }

    public async getMessage(req: Request, res: Response) {
        try {
            const token = req.params.token as string
            const chat_number = req.params.chat_number as string
            const msg_number = req.params.msg_number as string
            if(!token || !chat_number || !msg_number) {
                res.status(400).json({message: 'Missing required path params!'})
                return
            }
            const chatNumber = Number(chat_number)
            const msgNumber = Number(msg_number)
            const message = await this.messageService.getMessage(token, chatNumber, msgNumber)
            if(message === null) {
                res.status(404).json({})
                return
            }
            res.status(200).json(new MessageresponseDTO(message))
        } catch (error) {
            if(error instanceof ResourceNotFoundError) {
                res.status(404).json({error: error.message})
            } else {
                res.status(500).json({error: 'Internal server error!'})
            }
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const token = req.params.token as string
            const chat_number = req.params.chat_number as string
            const msg_number = req.params.msg_number as string
            if(!token || !chat_number || !msg_number) {
                res.status(400).json({message: 'Missing required path params!'})
                return
            }
            const chatNumber = Number(chat_number)
            const msgNumber = Number(msg_number)
            await this.messageService.delete(token, chatNumber, msgNumber)
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