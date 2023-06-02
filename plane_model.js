const mongoose = require('mongoose');
require('dotenv/config');

mongoose.connect(
  process.env.MONGODB_CONNECT_STRING,
  { useNewUrlParser: true }
);

const db = mongoose.connection;

const planeSchema = mongoose.Schema({
  planeID: { type: Number, required: true },
  year: { type: Number, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  color: { type: String, required: true },
  horsepower: { type: Number, required: true },
  vfr: { type: Boolean, required: false },
});

const Plane = mongoose.model('Plane', planeSchema);

const createPlane = async (planeID, year, make, model, color, horsepower, vfr) => {
  const plane = new Plane({
    planeID: planeID,
    year: year,
    make: make,
    model: model,
    color: color,
    horsepower: horsepower,
    vfr: vfr,
  });

  try {
    const savedPlane = await plane.save();
    return savedPlane;
  } catch (error) {
    // Handle any errors that occur during the save operation
    throw new Error(error.message);
  }
};

const findPlaneID = async (filter) => {
  const query = Plane.find(filter);
  return query.exec();
};

const findAllPlanes = async () => {
  try {
    const planes = await Plane.find();
    return planes;
  } catch (error) {
    throw new Error('Failed to retrieve planes');
  }
};

const updatePlane = async (filter, update) => {
  try {
    const result = await Plane.updateOne(filter, update);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deletePlane = async (filter) => {
  const delResult = await Plane.deleteMany(filter);
  return delResult.deletedCount;
};

db.once('open', () => {
  console.log('Successfully connected to MongoDB using Mongoose!');
});

module.exports = {
  createPlane,
  findPlaneID,
  updatePlane,
  deletePlane,
  findAllPlanes,
};
