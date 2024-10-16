const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// MIDDLEWARE to check dist first when handling GET request
app.use(express.static("dist"));

// take json-parser MIDDLEWARE to use
app.use(express.json());

// cors MIDDLEWARE to allow cross origin requests
app.use(cors());

// custom morgan token to log request body
morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

// custom morgan format to log POST data
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const generateId = () => {
  let id = 0;

  do {
    // generate id
    id = String(Math.floor(Math.random() * 1000));
    console.log("ID IS NOW:", id);
    // let's make sure that we have no duplicate IDs
  } while (persons.find((p) => p.id === id));

  return id;
};

let persons = [
  {
    id: "1",
    name: "Sydney Sweeney",
    number: "050-2340983",
  },
  {
    id: "2",
    name: "Scarlett Johansson",
    number: "040-1234567",
  },
  {
    id: "3",
    name: "Emilia Clarke",
    number: "046-1234567",
  },
  {
    id: "4",
    name: "Ana De Armas",
    number: "040-9847395",
  },
  {
    id: "5",
    name: "Jennifer Lawrence",
    number: "044-5559876",
  },
];

// GET REQUEST HANDLERS
app.get("/", (request, response) => {
  response.send("<h2>Puhelinluettelo backend</h2>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => id === p.id);
  console.log("person: ", person);

  if (person) response.json(person);
  else response.status(404).end();
});

app.get("/info", (request, response) => {
  const personCount = persons.length;
  let currentDateTime = new Date();
  currentDateTime.toLocaleDateString();

  response.send(`<p>
      Phonebook has info for ${personCount} people
      <br></br>
      ${currentDateTime}
    </p>`);
});

// POST REQUEST HANDLER
app.post("/api/persons", (request, response) => {
  const body = request.body; // aquire data from body

  if (!body.name || !body.number)
    // (400 bad request)
    return response.status(400).json({ error: "name or number missing" });

  if (persons.find((p) => p.name.toLowerCase() === body.name.toLowerCase()))
    return response.status(400).json({ error: "name must be unique" });

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  console.log("PERSON:", person);
  // console.log("REQUEST HEADERS", request.headers);

  persons = persons.concat(person);
  response.json(person);
});

// DELETE REQUEST HANDLER
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => id !== p.id);

  response.status(204).end();
});

// use environment variable PORT or 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
