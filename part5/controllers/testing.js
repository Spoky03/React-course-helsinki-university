const router = require('express').Router()
const Blog = require('../models/BlogPost')
const User = require('../models/User')

router.get('/', async (request, response) => {  
    const users = await User.find({})
    response.json(users)
    }
)
router.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router