import { Request, Response } from "express";
import Joi from "joi";

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

function getAll(req: Request, res: Response) {
  res.status(200).json(planets);
  console.log("Retrieved the planets");
}

function getOneById(req: Request, res: Response) {
  const { id } = req.params;
  const planet = planets.find((world) => world.id === Number(id));

  if (!planets.find((world) => world.id === Number(id))) {
    return res.status(404).json({ msg: "Planet not found" });
  }

  res.status(200).json(planet);
  console.log(`Retrieved selected planet`);
}

function create(req: Request, res: Response) {
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
}

function updateById(req: Request, res: Response) {
  const { id } = req.params;
  const { name } = req.body;
  const { error, value } = planetSchema.validate({ id, name });

  if (!planets.find((world) => world.id === Number(id))) {
    return res.status(404).json({ msg: "Planet not found" });
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
}

function deleteById(req: Request, res: Response) {
  const { id } = req.params;
  planets = planets.filter((world) => world.id !== Number(id));

  console.log(planets);
  res.status(200).json({ msg: "Planet Deleted" });
}

export {
  getAll, getOneById, create, updateById, deleteById
}
