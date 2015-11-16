import { Router } from 'express'

const router = new Router()

router.get('/', (req, res) => {
  res.json([
    {
      id: '1',
      name: 'john doe',
      phone: '703-703-7033',
      email: 'email@email.com'
    },
    {
      id: '2',
      name: 'john smith',
      phone: '571-571-5711',
      email: 'electronic@mail.com'
    }
  ])
})

router.get('/:id', (req, res) => {
  res.json({
    id: req.params.id,
    name: 'john smith',
    phone: '703-703-7033',
    email: 'email@email.com'
  })
})

router.get('/:id/messages', (req, res) => {
  res.json(
    {
      id: req.params.id,
      messages: [
        'hello',
        'how are you',
        'go away'
      ]
    }
  )
})

export default router
