const blogpostsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/BlogPost')
const User = require('../models/User')

blogpostsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
      .populate('user', { username: 1, name: 1 })
    response.json(blogs)
  }
)

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }
  
blogpostsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const user = await User.findById(request.user.id)

    //const user = await User.findOne().sort({ _id: 1 })
  
    const newBlog = new Blog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: user._id
    })

    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
)

blogpostsRouter.delete('/:id', async (request, response) => {
  const user = await User.findById(request.user.id)
  const blog = await Blog.findById(request.params.id)
  
  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'unauthorized user' })
  }
})

module.exports = blogpostsRouter