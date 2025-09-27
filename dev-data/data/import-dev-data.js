const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    // userFindAndModify: false
    useUnifiedTopology: true
  })
  .then(() => console.log('Database connection established'));

const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8')
);

async function createTour() {
  try {
    await Tour.create(tours);
    console.log('Data successfully added to the Database');
    await mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
}
console.log(process.argv);
async function deleteTours() {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted from the Database');
    await mongoose.connection.close();
    console.log('Database connection closed successfully');
  } catch (err) {
    console.log(err);
  }
}

if (process.argv[2] === '--import') {
  createTour();
} else if (process.argv[2] === '--delete') {
  deleteTours();
}
