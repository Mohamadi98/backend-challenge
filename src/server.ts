import express from 'express'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())
const requestLogger: express.RequestHandler = (req, _res, next) => {
    console.log(req.method, req.path, " Body - ", req.body, " Params - ", req.params)
    next()
}
app.use(requestLogger)
app.get('/healthz', (_req, res) => {
    res.send('OK')
})

app.listen(3000, () => {
    console.log('Server running on PORT: 3000')
})