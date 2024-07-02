const AccountController = require("../controller/accountController")
const { protect, admin } = require("../middleware/AuthMiddleware")
const router = require("express").Router()


router.post("/register", AccountController.createAccount)
router.post("/login", AccountController.login)
router.get("/", AccountController.getAllAccounts)
router.get("/detail/:id", AccountController.getAccountById)
router.delete("/:id", AccountController.deleteAccount)
router.post("/:id", protect, AccountController.updateAccount)
router.put('/wishlist/:product', protect, AccountController.updateWishlist);
router.post("/update/password", protect, AccountController.updatePassword); 
router.post("/forgotPassword/email", AccountController.forgotPassword)
router.post("/reset-password/:token", AccountController.resetPassword);

module.exports = router