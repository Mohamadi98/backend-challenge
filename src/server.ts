import express from 'express'
import bodyParser from 'body-parser'
import { AppController } from './controllers/app'
import { Postgres } from './datastore/postgres'
import { Redis } from './datastore/redis'
import { AppService } from './services/app'
import { AppRepository } from './repositories/app'

(async ()=> {
    const app = express()
    const postgres = new Postgres()
    // const redis = new Redis()
    const appRepository = new AppRepository(postgres)
    const appService = new AppService(appRepository)
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
        // await redis.connect()
        // console.log('Redis connected Successfuly!')


        app.post('/api/app', (req, res) => appController.create(req, res))
        app.listen(3000, () => {
        console.log('Server running on PORT: 3000')
    })
    } catch (error) {
        console.error('Server startup error:', error)
        process.exit(1)
    }
})()