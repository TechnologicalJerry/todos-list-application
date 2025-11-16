import { Express } from "express";
import { createUserHandler } from "../controller/user.controller";
import validateResource from "../middleware/validateResource";
import { createUserSchema } from "../schema/user.schema";

export default function registerUserRoutes(app: Express) {
  /**
   * @openapi
   * '/api/users':
   *  post:
   *     tags:
   *     - User
   *     summary: Register a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.post("/api/users", validateResource(createUserSchema), createUserHandler);
}


