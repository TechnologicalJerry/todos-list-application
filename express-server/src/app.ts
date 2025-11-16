import express, { Request, Response } from "express";
import cors from "cors";
import responseTime from "response-time";
import deserializeUser from "./middleware/deserializeUser";
import { restResponseTimeHistogram } from "./utils/metrics";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(deserializeUser);

app.use(
	responseTime((req: Request, res: Response, time: number) => {
		if (req?.route?.path) {
			restResponseTimeHistogram.observe(
				{
					method: req.method,
					route: req.route.path,
					status_code: res.statusCode,
				},
				time * 1000
			);
		}
	})
);

export default app;


