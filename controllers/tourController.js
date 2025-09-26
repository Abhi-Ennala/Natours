const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkBody = (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({
      status: 'fail',
      message: `Your body doesn't contain name property`
    });
  }
  if (!req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: `Your body doesn't contain price property`
    });
  }

  next();
};

exports.checkID = (req, res, next, id) => {
  id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid Id'
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};

exports.getTour = (req, res) => {
  //My logic
  const tour = tours[req.params.id];

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

exports.createTour = (req, res) => {
  //My logic
  // const newId = tours[tours.length - 1].id + 1;
  // const newTours = tours
  // newTours.push(req.body);
  // newTours[newTours.length - 1].id = newId;

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err) console.log(err);
    }
  );
  res.send(tours);
};

exports.updateTour = (req, res) => {
  const { id } = req.body;
  tours[id] = req.body;

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err) console.log(err);
    }
  );

  res.status(200).json({
    status: 'success'
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success'
  });
};
