const Tour = require('./../models/tourModel');

class APIFeatures {
  constructor(query, reqQueryObject) {
    this.query = query;
    this.reqQueryObject = reqQueryObject;
  }

  filter() {
    // 1a) Filtering
    const queryObj = { ...this.reqQueryObject };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);

    // 1b) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = Tour.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.reqQueryObject.sort) {
      const sortBy = this.reqQueryObject.sort.split(',').join(' ');
      // console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.reqQueryObject.fields) {
      const fields = this.reqQueryObject.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  async paginate() {
    const page = this.reqQueryObject.page * 1 || 1;
    const limit = this.reqQueryObject.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // console.log(skip);

    this.query.skip(skip).limit(limit);

    if (this.reqQueryObject.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    return this;
  }
}
module.exports = APIFeatures;
