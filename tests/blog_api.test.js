const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const mongoose = require("mongoose")
const Blogs = require("../models/blog")

const helper = require("../utils/helper")

beforeEach(async () => {
  await Blogs.deleteMany({})
  const blogToSave = helper.initialBlogList.map(blog => new Blogs(blog))
  const promiseArray = blogToSave.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test("should return the right amount of blogposts in json format", async () => {
  const response = await api.get("/api/blogs")
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)
  expect(helper.initialBlogList.length).toBe(response.body.length)
})

test("should verify the unique property of returned blogs exist", async () => {
  const response = await api.get("/api/blogs")
  for (let blog of response.body) {
    expect(blog.id).toBeDefined()
  }
})

test("should verify that a new blog can be created", async () => {
  const newBlog = {
    title: "testTitle1",
    author: "testAuthor1",
    url: "testurl",
    likes: 7
  }
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)
  const response = await api.get("/api/blogs")
  const blogsInDB = await helper.blogsInDatabase()
  const authors = blogsInDB.map(blog => blog.author)
  expect(response.body.length).toBe(helper.initialBlogList.length + 1)
  expect(authors).toContain("testAuthor1")
})

afterAll(() => mongoose.connection.close())
