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

blogpostsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

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

blogpostsRouter.put('/:id', async (request, response) => {
  const user = await User.findById(request.user.id)
  const blog = await Blog.findById(request.params.id)
  console.log(request.body)
  // add 1 like to this blog
  let content = {}
  if (blog.likedBy.includes(user._id)) {
    if (request.body.like === -1) {
      content = {likes: blog.likes - 1, likedBy: blog.likedBy.filter(liked => liked.toString() !== user._id.toString()) }
    } else {
      content = {likes: blog.likes + 0 }
    }
  } else {
    if (request.body.like === 1) {
      content = {likes: blog.likes + 1, likedBy: blog.likedBy.concat(user._id) }
    } else {
      content = {likes: blog.likes + 0 }
    }
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, content, { new: true })
    response.json(updatedBlog)
})


module.exports = blogpostsRouter