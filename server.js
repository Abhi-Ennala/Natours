const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    // userFindAndModify: false
    useUnifiedTopology: true
  })
  .then(() => console.log('db connection successful'));

const port = 8080;
app.listen(port, () => {
  console.log('App is listening on port:', port);
});
