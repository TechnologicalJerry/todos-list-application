import supertest from "supertest";
import app from "../app";

describe("Healthcheck Endpoint", () => {
  it("should return status 200 for GET /healthcheck", async () => {
    const response = await supertest(app).get("/healthcheck");
    expect(response.status).toBe(200);
  });
});
