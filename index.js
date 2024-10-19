require("dotenv").config();
const express = require("express");
const app = express();
const Person = require("./models/person");
const morgan = require("morgan");
const cors = require("cors");

// MIDDLEWARE
// **********
// static-dist to prioritize dist when handling GET request
app.use(express.static("dist"));
// json-parser to access request.body
app.use(express.json());
// cors to allow cross origin requests
app.use(cors());

// custom morgan token to log request body
morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});
// custom morgan format to log POST data
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// HTTP GET endpoints
app.get("/", (request, response) => {
  response.send("<h2>Puhelinluettelo backend</h2>");
});

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((people) => {
      response.json(people);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) response.json(person);
      else response.status(404).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/info", (request, response, next) => {
  let currentDateTime = new Date();
  currentDateTime.toLocaleDateString();
  Person.find({})
    .then((people) => {
      console.log("PEOPLE LENGTH", people.length);
      response.send(`<p>
          Phonebook has info for ${people.length} people
          <br></br>
          ${currentDateTime}
        </p>`);
    })
    .catch((error) => next(error));
});

// HTTP POST endpoint
app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body; // aquire data from body

  const person = new Person({
    name: name,
    number: number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

// HTTP PUT (update)
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  // { new: true }, jotta saamme muuttuneen olion palautetuksi kutsujalle
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((error) => next(error));
});

// HTTP DELETE endpoint
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log("inside errorHandler");
  console.log(error.message);

  if (error.name === "CastError")
    return response.status(400).send({ error: "malformatted id" });
  else if (error.name === "ValidationError")
    return response.status(400).json({ error: error.message });

  next(error);
};

// tämä tulee kaikkien muiden middlewarejen ja routejen rekisteröinnin jälkeen!
app.use(errorHandler);

// use environment variable PORT or 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
