import cors from 'cors'
import express, {Router} from 'express'
import contacts from './routers/contacts'
import bodyparser from 'body-parser'

const app = express()
const router = new Router()

app.use(cors())
app.use(bodyparser.json({limit: '5mb'}))

app.use(router)

// Route setup
router.use('/contacts', contacts)

app.listen(process.env.PORT || 3000)
