const AccountController = require("../controller/accountController")
const { protect, admin } = require("../middleware/AuthMiddleware")
const router = require("express").Router()


router.post("/register", AccountController.createAccount)
router.post("/login", AccountController.login)
router.get("/", AccountController.getAllAccounts)
router.get("/detail/:id", AccountController.getAccountById)
router.delete("/:id", AccountController.deleteAccount)
router.post("/", protect, AccountController.updateAccount)
router.put('/wishlist/:product', protect, AccountController.updateWishlist);

module.exports = router