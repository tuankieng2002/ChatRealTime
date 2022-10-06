const express = require("express");
const userController = require("../user/user.controller");
const { verifyToken, isAdmin, isAdminOrUser } = require("../middleware/auth")

const router = express.Router();

router.post("/register", userController.createUser);

router.post("/login", userController.loginUser);

router.get("/", verifyToken, isAdmin, userController.getUsers);

router.put("/updateInfo/:id", verifyToken, isAdmin, userController.updateUser);

router.get("/getSingleUsers/:id", verifyToken, isAdminOrUser, userController.getSingleUsers);

router.delete("/deleteUser/:id", verifyToken, isAdmin, userController.deleteAdmin);

router.put("/changePassword/:id",  verifyToken, userController.changePassword);

router.post("/verifyOtp", verifyToken, userController.verifyOtp);

router.post("/refresh-token", userController.refToken);

router.delete("/logout", userController.logout);

router.put("/:id/follow", userController.follow);

router.put("/:id/unFollow", userController.unFollow);

//get a user
router.get("/get-a-user/", userController.getAUser);

module.exports = router;
