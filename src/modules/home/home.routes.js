import express from "express";
import { getHomePage } from "./home.controller.js";

const router = express.Router();

router.get("/homepage", getHomePage);

export default router;