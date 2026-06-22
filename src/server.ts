import express from 'express'
import bodyParser from 'body-parser'
import { postgres } from './datastore/postgres'

(async ()=> {
    const app = express()
    const postgresClient = new postgres()
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
        await postgresClient.query('SELECT NOW()')
        console.log('Database connected successfuly!')

        app.listen(3000, () => {
        console.log('Server running on PORT: 3000')
    })
    } catch (error) {
        console.error('Database connection failed:', error)
        process.exit(1)
    }
})()