import User from "../model/user-model.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import AppError from "../lib/app-error.js";
import bcrypt from "bcryptjs";
import Contact from "../model/contact.js";

export const signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return next(new AppError(404, "Provide all the required Fields"));

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppError(400, "User Already Exists"));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || "",
    {
      expiresIn: "30d",
    }
  );

  // Exclude password from the response
  // eslint-disable-next-line no-unused-vars
  const { password: _, ...userWithoutPassword } = user.toObject();

  res.status(201).json({
    status: true,
    statusCode: 201,
    message: "New User created",
    data: {
      user: userWithoutPassword,
      accessToken: token,
    },
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError(400, "Invalid Email or Password"));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new AppError(400, "Invalid Email or Password"));
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || "",
    {
      expiresIn: "30d",
    }
  );

  // Exclude password from the response
  // eslint-disable-next-line no-unused-vars
  const { password: _, ...userWithoutPassword } = user.toObject();

  res.status(200).json({
    status: true,
    statusCode: 200,

    message: "Logged in",
    data: {
      user: userWithoutPassword,
      accessToken: token,
    },
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  return res.status(200).json({
    status: true,
    code: 200,

    data: {
      users,
    },
  });
});

export const ContactUs = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, message } = req.body;

  if (!firstName || !lastName || !email || !message)
    return next(new AppError(400, "Proivde all the required fields"));

  const newContact = await Contact.create(req.body);

  if (!newContact) return next(new AppError(400, "Somthing went wrong"));

  return res.status(200).json({
    status: true,
    code: 200,
    message: "Message sent successfully",
  });
});
