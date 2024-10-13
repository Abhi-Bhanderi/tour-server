import { Router } from "express";
import { StrictlyProtected, UnStrictlyProtected } from "../middleware/auth.js";
import {
  addFavorite,
  bookTour,
  createSingleTour,
  getBookedTours,
  getFavorites,
  getSingleTour,
  getTours,
  removeFavorite,
  searchTours,
} from "../controllers/tours-controller.js";

const router = Router();

router.route("/").get(UnStrictlyProtected, getTours);
router.route("/:id").get(UnStrictlyProtected, getSingleTour);
router.route("/search/many").get(UnStrictlyProtected, searchTours);
router.route("/").post(StrictlyProtected, createSingleTour);
router.route("/book/one").post(bookTour);
router.route("/booked/all").get(getBookedTours);

// Mutate Favorites
router.route("/favorites/all").get(StrictlyProtected, getFavorites);
router.route("/favorites/:id").post(StrictlyProtected, addFavorite);
router.route("/favorites/:id").delete(StrictlyProtected, removeFavorite);

export default router;
