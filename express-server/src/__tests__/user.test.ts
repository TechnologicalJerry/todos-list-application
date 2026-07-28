import supertest from "supertest";
import app from "../app";
import * as UserService from "../service/user.service";

describe("User Routes & Service", () => {
  describe("POST /api/users", () => {
    it("should return 400 when required fields are missing", async () => {
      const response = await supertest(app).post("/api/users").send({
        email: "invalid-user",
      });
      expect(response.status).toBe(400);
    });

    it("should return 400 when password and passwordConfirmation do not match", async () => {
      const response = await supertest(app).post("/api/users").send({
        userName: "testuser",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123",
        passwordConfirmation: "differentpassword",
      });
      expect(response.status).toBe(400);
    });

    it("should return 200 and create user when payload is valid", async () => {
      const mockUser = {
        _id: "user123",
        userName: "testuser",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
      };

      const createUserSpy = jest
        .spyOn(UserService, "createUser")
        .mockResolvedValueOnce(mockUser as any);

      const response = await supertest(app).post("/api/users").send({
        userName: "testuser",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123",
        passwordConfirmation: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(createUserSpy).toHaveBeenCalled();
    });
  });
});
