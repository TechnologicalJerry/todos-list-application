import dotenv from "dotenv";
import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes/index.routes";
import { startMetricsServer } from "./utils/metrics";
import swaggerDocs from "./utils/swagger";
import app from "./app";

dotenv.config();

const port = config.get<number>("port");

app.listen(port, async () => {
  logger.info(`Application Server is running at http://localhost:${port}`);

  await connect();

  routes(app);

  startMetricsServer();

  swaggerDocs(app, port);
});
