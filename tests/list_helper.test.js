const list_helper = require("../utils/list_helper")
const blogs = require("../blogList")
const totalLikes = require("../utils/totalLikes")
test("should return one", () => {
  const blogs = []
  const result = list_helper.dummy(blogs)
  expect(result).toBe(1)
})

describe("total likes", () => {
  test("should return total number of likes", () => {
    expect(totalLikes(blogs)).toBe(36)
  })
})
