const blogRouter = require("express").Router()

const Blog = require("../models/blog")

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.post("/", async (request, response) => {
  const body = request.body

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
    likes: body.likes
  })
  const blogToSave = await newBlog.save()
  response.status(201).json(blogToSave.toJSON())
})
blogRouter.delete("/:id", async (request, response) => {
  const blogToDelete = request.params.id
  await Blog.findByIdAndRemove(blogToDelete)
  response.status(204).end()
})
module.exports = blogRouter
