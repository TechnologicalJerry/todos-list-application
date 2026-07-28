import supertest from "supertest";
import app from "../app";
import * as TodoService from "../service/todo.service";

describe("Todo Routes", () => {
  describe("POST /api/todos", () => {
    it("should return 403 if user is not authenticated", async () => {
      const response = await supertest(app).post("/api/todos").send({
        title: "Test Todo",
      });
      expect(response.status).toBe(403);
    });
  });

  describe("GET /api/todos", () => {
    it("should return 403 if user is not authenticated", async () => {
      const response = await supertest(app).get("/api/todos");
      expect(response.status).toBe(403);
    });
  });
});
