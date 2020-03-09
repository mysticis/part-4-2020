const blogRouter = require("express").Router()
const User = require("../models/user")
const Blog = require("../models/blog")

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("users", { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.post("/", async (request, response, next) => {
  const body = request.body
  const user = await User.findById(body.userId)
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
  const blogToDelete = request.params.id
  await Blog.findByIdAndRemove(blogToDelete)
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
