const express = require("express");
const app = express();

// json-parser käyttöön
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

app.get("/", (request, response) => {
  response.send("<h2>Puhelinluettelo backend</h2>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
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

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
