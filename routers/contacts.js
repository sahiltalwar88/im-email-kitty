import { Router } from 'express'
import { easyquery } from '../lib/db'

const router = new Router()

router.get('/', (req, res) => {
  easyquery('SELECT * from contacts', {}, res)
})

router.get('/:id', (req, res) => {
  easyquery('SELECT name, id from contacts WHERE id = $id', { id: req.params.id }, res)
})

router.get('/:id/messages', (req, res) => {
  easyquery('SELECT * from messages WHERE contact_id = $id', { id: req.params.id }, res)
})

router.post('/:id/messages', (req, res) => {
  var query = 'INSERT INTO messages (sent, message_text, contact_id, message_type) VALUES ($sent, $message_text, $contact_id, $message_type)'
  easyquery(query, { sent: true, message_text: req.body.message_text, contact_id: req.body.contact_id, message_type: req.body.message_type }, res)
})

export default router
