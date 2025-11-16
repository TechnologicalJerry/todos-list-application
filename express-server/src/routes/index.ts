import { Express, Request, Response } from "express";
import registerUserRoutes from "./user.routes";
import registerSessionRoutes from "./session.routes";
import registerProductRoutes from "./product.routes";

export default function registerRoutes(app: Express) {
  /**
   * @openapi
   * /healthcheck:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  registerUserRoutes(app);
  registerSessionRoutes(app);
  registerProductRoutes(app);
}

