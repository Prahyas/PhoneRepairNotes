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
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, roles, active } = req.body;

  console.log(req.body);

  // validate the request data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check if user exist
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // check duplicate user
  const duplicate = await User.findOne({ username }).lean().exec();
  // allow updates to original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(400).json({ message: "Duplicate user." });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({
    message: `${updatedUser.username} has been updated`,
  });
});

// delete user and save it to the database
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: `User id required` });
  }

  const notes = await User.findOne({ user: id }).lean().exec();
  if (notes?.length) {
    res.status(400).json({ message: `User has assigned notes` });
  }

  const user = await User.findById(id).exec();
  console.log(user);

  if (!user) {
    res.status(400).json({ message: `User not found` });
  }

  res.status(200).json({ message: `${user.username} has been deleted` });
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
