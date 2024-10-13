import asyncHandler from "express-async-handler";
import AppError from "../lib/app-error.js";
import Tour from "../model/tour-model.js";
import User from "../model/user-model.js";
import BookTour from "../model/book-tour-model.js";

export const getTours = asyncHandler(async (req, res) => {
  const { search } = req.query;

  let queryObj = {};

  if (search) {
    queryObj = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };
  }

  const tours = await Tour.find(queryObj);

  if (!req.isAuth) {
    return res.status(200).json({
      status: true,
      code: 200,
      results: tours.length,
      data: { tours },
    });
  }

  const userId = req.userId;

  const user = await User.findById(userId).populate("favorites");

  const favoritesIds = new Set(user.favorites.map((u) => u._id.toString()));

  const toursWithFav = tours.map((q) => ({
    ...q._doc,
    isUserFavorite: favoritesIds.has(q._id.toString()),
  }));

  return res.status(200).json({
    status: true,
    code: 200,
    results: toursWithFav.length,
    data: { tours: toursWithFav },
  });
});

export const getSingleTour = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!id) return next(new AppError(400, "Tour id does not found!"));

  let tour = await Tour.findById(id);

  if (!tour) return next(new AppError(404, "No tour found!"));

  return res.status(200).json({
    status: true,
    code: 200,
    data: { tours: tour },
  });
});

export const searchTours = asyncHandler(async (req, res, next) => {
  const search = req.query.search;
  let queryOBJ = {};

  if (search) {
    queryOBJ = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };
  }

  let tours = await Tour.find(queryOBJ);

  if (!tours) return next(new AppError(404, "No tours found!"));

  return res.status(200).json({
    status: true,
    code: 200,
    data: { tours },
  });
});

export const createSingleTour = asyncHandler(async (req, res, next) => {
  if (!req.body) return next(new AppError(404, "Tour not found!"));

  let newTour = await Tour.create(req.body);

  return res.status(200).json({
    status: true,
    code: 200,
    data: { tours: newTour },
  });
});

export const bookTour = asyncHandler(async (req, res, next) => {
  if (
    !req.body.numberOfTickets ||
    !req.body.pricePerTicket ||
    !req.body.name ||
    !req.body.email
  )
    return next(new AppError(400, "Proivde all the required fields"));

  const newBookTour = await BookTour.create({
    ...req.body,
    totalPayment: req.body.numberOfTickets * req.body.pricePerTicket,
  });

  return res.status(200).json({
    status: true,
    code: 200,
    data: { tours: newBookTour },
  });
});
export const getBookedTours = asyncHandler(async (req, res) => {
  const bookedTours = await BookTour.find({});

  res.status(200).json({
    status: true,
    code: 200,
    data: { tours: bookedTours },
  });
});

export const addFavorite = asyncHandler(async (req, res, next) => {
  const tourId = req.params.id;
  const userId = req.userId;

  if (!userId) return next(new AppError(401, "You are Unauthenticated!"));

  const user = await User.findById(userId);

  if (!user)
    return next(new AppError(404, "No user found with the provided user Id"));

  if (user.favorites.includes(tourId))
    return next(
      new AppError(400, "This tour is already in your favorites list.")
    );

  const userWithFavTours = await User.findByIdAndUpdate(userId, {
    $push: { favorites: tourId },
  });

  if (!userWithFavTours)
    return next(
      new AppError(400, "Somthing went wrong while adding the favrite.")
    );

  return res.status(204).json({
    status: true,
    code: 200,
    data: { user: userWithFavTours },
  });
});

export const getFavorites = asyncHandler(async (req, res, next) => {
  const userId = req.userId;

  if (!userId) return next(new AppError(401, "You are Unauthenticated!"));

  const user = await User.findById(userId).populate("favorites");

  if (!user)
    return next(new AppError(404, "No user found with the provided user Id"));

  const favorites = user.favorites.map((fav) => ({
    ...fav._doc,
    isUserFavorite: true,
  }));
  console.log("favorites ~ favorites:", favorites);

  return res.status(200).json({
    status: true,
    code: 200,
    data: { tours: favorites },
  });
});

export const removeFavorite = asyncHandler(async (req, res, next) => {
  const tourId = req.params.id;
  const userId = req.userId;

  if (!userId) return next(new AppError(401, "You are Unauthenticated!"));

  const user = await User.findById(userId);

  if (!user)
    return next(new AppError(404, "No user found with the provided user Id"));

  if (!user.favorites.includes(tourId))
    return next(
      new AppError(
        400,
        "There are no tour with the provided Id in your favorites"
      )
    );

  const userWithRemovedFav = await User.findByIdAndUpdate(userId, {
    $pull: { favorites: tourId },
  });

  if (!userWithRemovedFav)
    return next(
      new AppError(400, "Somthing went wrong while adding the favrite.")
    );

  return res.status(204).json({
    status: true,
    code: 200,
    data: { user: userWithRemovedFav },
  });
});
