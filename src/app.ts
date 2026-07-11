import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger";

const app = express();

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "MyFavShip API",
  })
);
app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads"))
);
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin(origin, callback) {
      // Permite ferramentas sem Origin, como Swagger, Postman e curl.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origem não permitida pelo CORS."));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    message: "API MyFavShip rodando!",
  });
});

app.use("/api", routes);

app.use(errorMiddleware);

export default app;