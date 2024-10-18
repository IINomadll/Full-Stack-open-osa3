const mongoose = require("mongoose");

// FUNCTIONS
const addPerson = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(url);

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model("Person", personSchema);

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
};

const printPhonebook = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(url);

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model("Person", personSchema);

  console.log("phonebook:");

  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
};

// CODE
if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.em1v2.mongodb.net/phoneBookApp?retryWrites=true&w=majority`;

if (process.argv.length === 5) {
  addPerson();
} else if (process.argv.length === 3) {
  printPhonebook();
}
