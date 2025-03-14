const express = require("express");
const router = express.Router();

const {AddToCart, CartPackageApproval, GetCartDetailsForClub, GetCartDetailsForUser, DeletePackageFromCart, CartPackageReject} = require("../contollers/CartController");

router.post("/AddToCart/:userID/:packageID/:gymID", AddToCart)
router.put("/CartPackageApproval/:cartPackageID", CartPackageApproval)
router.get("/GetCartDetailsForClub/:gymID", GetCartDetailsForClub)
router.get("/GetCartDetailsForUser/:userID", GetCartDetailsForUser)
router.delete("/DeletePackageFromCart/:cartPackageID", DeletePackageFromCart)
router.delete("/CartPackageReject/:cartPackageID/:userID", CartPackageReject)

module.exports = router