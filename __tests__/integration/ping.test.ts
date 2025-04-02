import { StatusCodes } from "http-status-codes"
import request from "supertest"
import { createApp } from "../../src/create-app"

describe("GET /api/v1/ping", () => {
  const app = createApp()

  it("should return OK 200 and a pong message", async () => {
    const response = await request(app).get("/api/v1/ping")

    expect(response.status).toBe(StatusCodes.OK)
    expect(response.body).toEqual({ message: "pong" })
  })
})
