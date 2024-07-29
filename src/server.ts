import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
} from "./controllers/planets.js";
const app = express();
dotenv.config();
const port = process.env.PORT_NUMBER;

/* I'll leave out from the git.ignore the .env file for exercise reason,
usually I'd include it in the ignoring file and avoid
sharing it in the repo */

app.use(morgan("dev"));
app.use(express.json());

app.get("/api/planets", getAll);

app.get("/api/planets/:id", getOneById);

app.post("/api/planets", create);

app.put("/api/planets/:id", updateById);

app.delete("/api/planets/:id", deleteById);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
