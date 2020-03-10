const blogRouter = require("express").Router()
const User = require("../models/user")
const Blog = require("../models/blog")
const jwt = require("jsonwebtoken")

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("users", { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.post("/", async (request, response, next) => {
  const body = request.body
  const token = request.token
  //const user = await User.findById(body.userId)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "unauthorized user" })
  }
  const user = await User.findById(decodedToken.id)
  if (!body.likes) {
    body.likes = 0
  }
  if (!body.title || !body.url) {
    return response.status(400).json({ error: "title and/or url is missing" })
  }
  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  const blogToSave = await newBlog.save()
  user.blogs = user.blogs.concat(blogToSave._id)
  await user.save()
  response.status(201).json(blogToSave.toJSON())
})
blogRouter.delete("/:id", async (request, response) => {
  const blogs = await Blog.find({})
  const blogsInDatabase = blogs.map(blog => blog.toJSON())

  const blogToDel = blogsInDatabase.filter(
    blog => blog.id === request.params.id
  )

  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  console.log(decodedToken)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "invalid token" })
  } else if (blogToDel[0].user.toString() !== decodedToken.id.toString()) {
    return response.status(401).json({ error: "unauthorized user" })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
blogRouter.put("/:id", async (request, response) => {
  const body = request.body
  const blogToUpdate = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { ...blogToUpdate, likes: body.likes },
    { new: true }
  )
  response.status(200).json(updatedBlog.toJSON())
})
module.exports = blogRouter
