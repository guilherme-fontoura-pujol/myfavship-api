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
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    message: "API MyFavShip rodando!",
  });
});

app.use("/api", routes);

app.use(errorMiddleware);

export default app;