import express from 'express'
import bodyParser from 'body-parser'
import { AppController } from './controllers/app'
import { Postgres } from './datastore/postgres'
import { Redis } from './datastore/redis'
import { AppService } from './services/app'
import { AppRepository } from './repositories/app'
import { InitializeChatWorker } from './queues/workers'
import { ChatRepository } from './repositories/chat'
import { ChatController } from './controllers/chat'
import { ChatService } from './services/chat'
import { ChatQueue } from './queues/chat'

(async ()=> {
    const app = express()
    const postgres = new Postgres()
    const redis = new Redis()
    const chatQueue = new ChatQueue(redis)
    const appRepository = new AppRepository(postgres)
    const chatRepository = new ChatRepository(postgres)
    const appService = new AppService(appRepository, redis)
    const chatService = new ChatService(redis, chatQueue, appRepository, chatRepository)
    const chatController = new ChatController(chatService)
    const appController = new AppController(appService)
    const requestLogger: express.RequestHandler = (req, _res, next)=> {
        console.log(
            req.method, req.path, " Body - ", req.body, " Params - ", req.params
        )
        next()
    }
    app.use(bodyParser.json())
    app.use(requestLogger)

    app.get('/healthz', (_req, res) => {
        res.send({'Status': 'OK'})
    })

    try {
        await postgres.connect()
        console.log('Database connected successfuly!')
        await redis.connect()
        console.log('Redis connected Successfuly!')
        InitializeChatWorker(chatRepository, redis)


        app.post('/api/app', (req, res) => appController.create(req, res))
        app.get('/api/app/:token', (req, res) => appController.getByToken(req, res))
        app.delete('/api/app/:token', (req, res) => appController.deleteByToken(req, res))
        app.post('/api/app/chat', (req, res) => chatController.create(req, res))
        app.get('/api/apps/:token/chats', (req, res) => chatController.getChatsByappToken(req, res))

        app.listen(3000, () => {
        console.log('Server running on PORT: 3000')
    })
    } catch (error) {
        console.error('Server startup error:', error)
        process.exit(1)
    }
})()