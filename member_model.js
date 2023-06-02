const mongoose = require('mongoose');
require('dotenv/config');

mongoose.connect(
  process.env.MONGODB_CONNECT_STRING,
  { useNewUrlParser: true }
);

const db = mongoose.connection;

const memberSchema = mongoose.Schema({
  memberID: { type: Number, required: true },
  certificateID: { type: Number, required: false },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  email: { type: String, required: false },
  dob: { type: Date, required: true },
});

const Member = mongoose.model('Member', memberSchema);

const createMember = async (
  memberID,
  certificateID,
  lastName,
  firstName,
  address,
  phoneNumber,
  email,
  dob
) => {
  const member = new Member({
    memberID: memberID,
    certificateID: certificateID,
    lastName: lastName,
    firstName: firstName,
    address: address,
    phoneNumber: phoneNumber,
    email: email,
    dob: dob,
  });

  try {
    const savedMember = await member.save();
    return savedMember;
  } catch (error) {
    // Handle any errors that occur during the save operation
    throw new Error(error.message);
  }
};

const findMember = async (filter) => {
  const query = Member.find(filter);
  return query.exec();
};

const findAllMembers = async () => {
  try {
    const members = await Member.find();
    return members;
  } catch (error) {
    throw new Error('Failed to retrieve members');
  }
};

const updateMember = async (filter, update) => {
  try {
    const result = await Member.updateOne(filter, update);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteMember = async (filter) => {
  const delResult = await Member.deleteMany(filter);
  return delResult.deletedCount;
};

db.once('open', () => {
  console.log('Successfully connected to MongoDB using Mongoose!');
});

module.exports = {
  createMember,
  findMember,
  updateMember,
  deleteMember,
  findAllMembers,
};