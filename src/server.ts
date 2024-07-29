import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv"

const app = express();
dotenv.config()
const port = process.env.PORT_NUMBER;

/* I'll leave out from the git.ignore the .env file for exercise reason,
usually I'd include it in the ignoring file and avoid
sharing it in the repo */

app.use(morgan("dev"));
app.use(express.json());

type Planet = {
  id: number;
  name: string;
};

type Planets = Planet[];

let planets: Planets = [
  {
    id: 1,
    name: "Earth",
  },
  {
    id: 2,
    name: "Mars",
  },
];

app.get("/api/planets", (req, res) => {
  res.status(200).json(planets);
  console.log("Retrieved the planets")
});

app.get("/api/planets/:id", (req, res) => {
  const { id } = req.params
  const planet = planets.find((world) => world.id === Number(id))

  res.status(200).json(planet)
  console.log(`Retrieved selected planet`)
});

app.post("/api/planets", (req, res) => {
  const {id, name} = req.body
  const newPlanet = {id, name}
  planets = [...planets, newPlanet]

  res.status(201).json({msg: "The planet was added"})

  console.log("New Planet added to the list", planets)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
