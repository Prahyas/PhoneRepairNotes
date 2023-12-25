// async handler handles async operations without try catch block
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

// gets all users from the database
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found!" });
  }
  res.json(users);
});

// create new user and save it to the database
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  // validate the request data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //check duplicate data
  const duplicateUser = await User.findOne({ username }).lean().exec();
  if (duplicateUser) {
    return res.status(409).json({ message: "User already exist" });
  }

  //hashing password
  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedUserObj = { username, password: hashedPassword, roles };

  //saving the data to database
  const user = await User.create(hashedUserObj);
  if (user) {
    res.status(201).json({ message: `New user ${username} is created` });
  } else {
    res.status(400).json({ message: `Invalid user data recieved` });
  }
});

// update user and save it to the database
const updateUser = asyncHandler(async (req, res) => {});

// delete user and save it to the database
const deleteUser = asyncHandler(async (req, res) => {});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
