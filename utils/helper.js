const blogModel = require("../models/blog")
const initialBlogList = require("../blogList")
const blogsInDatabase = async () => {
  const blogs = await blogModel.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  blogsInDatabase,
  initialBlogList
}
