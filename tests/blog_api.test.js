const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const mongoose = require("mongoose")
const Blogs = require("../models/blog")

const helper = require("../utils/helper")

beforeEach(async () => {
  await Blogs.deleteMany({})
  const blogToSave = helper.map(blog => new Blogs(blog))
  const promiseArray = blogToSave.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test("should return the right amount of blogposts in json format", async () => {
  const response = await api.get("/api/blogs")
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)
  expect(helper.length).toBe(response.body.length)
})

test("should verify the unique property of returned blogs exist", async () => {
  const response = await api.get("/api/blogs")
  for (let blog of response.body) {
    expect(blog.id).toBeDefined()
  }
})

afterAll(() => mongoose.connection.close())
