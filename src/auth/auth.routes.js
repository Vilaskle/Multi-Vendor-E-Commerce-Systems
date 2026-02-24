
// import express from "express";
// import { registerUser,
//     requestUserLoginOtp,
//   verifyUserLoginOtp } from "./auth.controller.js";

// const router = express.Router();


// // User Registration
// router.post("/user/register", registerUser);
// router.post("/user/login", requestUserLoginOtp);
// router.post("/user/login/verify-otp", verifyUserLoginOtp);


// export default router;


import express from "express";
import { registerUser,
    requestUserLoginOtp,
  verifyUserLoginOtp } from "./auth.controller.js";

const router = express.Router();


// User Registration
router.post("/user/register", registerUser);
router.post("/user/login", requestUserLoginOtp);
router.post("/user/login/verify-otp", verifyUserLoginOtp);


export default router;