/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import fs from 'fs'
import cors from 'cors'
import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'

const MESSAGE_FILE = path.join(__dirname, 'messages.json')
const app = express()

app.use(cors)

app.set('port', (process.env.PORT || 3000))

app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/api/messages', (req, res) => {
  fs.readFile(MESSAGE_FILE, (err, data) => {
    if (err) {
      res.status(500).send('BORKEN!')
    }
    res.setHeader('Cache-Control', 'no-cache')
    res.json(JSON.parse(data))
  })
})

app.post('/api/MESSAGE_FILE', (req, res) => {
  fs.readFile(MESSAGE_FILE, (err, data) => {
    if (err) {
      res.status(500).send('BORKEN!')
    }
    var comments = JSON.parse(data)
    comments.push(req.body)
    fs.writeFile(MESSAGE_FILE, JSON.stringify(comments, null, 4), err => {
      if (err) {
        res.status(500).send('BORKEN!')
      }
      res.setHeader('Cache-Control', 'no-cache')
      res.json(comments)
    })
  })
})

app.listen(app.get('port'), () => {
  console.log('Server started: http://localhost:' + app.get('port') + '/')
})
