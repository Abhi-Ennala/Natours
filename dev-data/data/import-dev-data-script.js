const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');

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

const reviews = JSON.parse(
  fs.readFileSync('./dev-data/data/reviews.json', 'utf-8')
);
const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours.json', 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync('./dev-data/data/users.json', 'utf-8')
);

async function createCollection() {
  try {
    await Review.create(reviews);
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    console.log('Data successfully added to the Database');
    await mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
}
// console.log(process.argv);
async function deleteCollection() {
  try {
    await Review.deleteMany();
    await Tour.deleteMany();
    await User.deleteMany();
    console.log('Data successfully deleted from the Database');
    await mongoose.connection.close();
    console.log('Database connection closed successfully');
  } catch (err) {
    console.log(err);
  }
}

if (process.argv[2] === '--import') {
  createCollection();
} else if (process.argv[2] === '--delete') {
  deleteCollection();
}
