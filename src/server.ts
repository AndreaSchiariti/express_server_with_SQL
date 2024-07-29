import express, { Request, Response } from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import Joi from "joi";

const app = express();
dotenv.config();
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

const planetSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
});


app.get("/api/planets", (req: Request, res: Response) => {
  res.status(200).json(planets);
  console.log("Retrieved the planets");
});

app.get("/api/planets/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const planet = planets.find((world) => world.id === Number(id));

  if (!planets.find((world) => world.id === Number(id))){
    return res.status(404).json({msg: "Planet not found"})
  }

  res.status(200).json(planet);
  console.log(`Retrieved selected planet`);
});

app.post("/api/planets", (req: Request, res: Response) => {
  const { error, value } = planetSchema.validate(req.body, {
    abortEarly: false,
  });

  /* I use the abortEarly:false to see on the log if there is more than one error*/
  if (error) {
    console.log(error.details);
    return res.status(400).json({ msg: "Wrong Parameters" });
  }
  const { id, name } = req.body;
  const newPlanet = { id, name };
  planets = [...planets, newPlanet];

  res.status(201).json({ msg: "The planet was added" });

  console.log("New Planet added to the list", planets);
});

app.put("/api/planets/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const { error, value } = planetSchema.validate({id, name});

  if (!planets.find((world) => world.id === Number(id))){
    return res.status(404).json({msg: "Planet not found"})
  }

  if (error) {
    console.log(error.details);
    return res.status(400).json({ msg: "Wrong Parameter" });
  }

  planets = planets.map((world) =>
    world.id === Number(id) ? { ...world, name } : world
  );

  console.log("Planet Updated", planets);
  res.status(200).json({ msg: "Planet updated" });
});

app.delete("/api/planets/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  planets = planets.filter((world) => world.id !== Number(id));

  console.log(planets);
  res.status(200).json({ msg: "Planet Deleted" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
