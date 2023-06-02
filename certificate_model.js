const mongoose = require('mongoose');
require('dotenv/config');

mongoose.connect(
  process.env.MONGODB_CONNECT_STRING,
  { useNewUrlParser: true }
);

const db = mongoose.connection;

const certificateSchema = mongoose.Schema({
  certificateNumber: { type: Number, required: true },
  name: { type: String, required: true },
  Address: { type: String, required: true },
  nationality: { type: String, required: true },
  dob: { type: Date, required: true },
});

const Certificate = mongoose.model('Certificate', certificateSchema);

const createUserCertificate = async (certificateNumber, name, Address, nationality, dob) => {
  const userCertificate = new Certificate({
    certificateNumber: certificateNumber,
    name: name,
    Address: Address,
    nationality: nationality,
    dob: dob,
  });

  try {
    const savedCertificate = await userCertificate.save();
    return savedCertificate;
  } catch (error) {
    // Handle any errors that occur during the save operation
    throw new Error(error.message);
  }
};

const findUserCertificate = async (filter) => {
  const query = Certificate.find(filter);
  return query.exec();
};

const updateUserCertificate = async (filter, update) => {
  try {
    const result = await Certificate.updateOne(filter, update);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteCertificate = async (filter) => {
  const delResult = await Certificate.deleteMany(filter);
  return delResult.deletedCount;
};

db.once('open', () => {
  console.log('Successfully connected to MongoDB using Mongoose!');
});

module.exports = {
  createUserCertificate,
  findUserCertificate,
  updateUserCertificate,
  deleteCertificate,
  Certificate,
};



