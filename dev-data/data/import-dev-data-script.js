const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');

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

async function createReview() {
  try {
    await Review.create(reviews);
    console.log('Data successfully added to the Database');
    await mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
}
// console.log(process.argv);
async function deleteReview() {
  try {
    await Review.deleteMany();
    console.log('Data successfully deleted from the Database');
    await mongoose.connection.close();
    console.log('Database connection closed successfully');
  } catch (err) {
    console.log(err);
  }
}

if (process.argv[2] === '--import') {
  createReview();
} else if (process.argv[2] === '--delete') {
  deleteReview();
}
