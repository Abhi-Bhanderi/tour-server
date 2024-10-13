import { Router } from "express";
import {
  ContactUs,
  getUsers,
  login,
  signUp,
} from "../controllers/auth-controller.js";

const router = Router();

router.route("/sign-up").post(signUp);
router.route("/log-in").post(login);
router.route("/contact-us").post(ContactUs);
router.route("/users").get(getUsers);

export default router;
