const express = require("express");
const app = express();

// take json-parser to use
app.use(express.json());

const PORT = 3001;

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
    name: "Kate Upton",
    number: "045-3458761",
  },
  {
    id: "6",
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

// DELETE REQUEST HANDLER
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => id !== p.id);

  response.status(204).end();
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
