const AccountController = require("../controller/accountController")
const { protect, admin } = require("../middleware/AuthMiddleware")
const router = require("express").Router()


router.post("/register", AccountController.createAccount)
router.post("/login", AccountController.login)
router.get("/", AccountController.getAllAccounts)
router.get("/detail/:id", protect, AccountController.getAccountById)
router.delete("/:id", AccountController.deleteAccount)
router.put("/:id", AccountController.updateAccount)

module.exports = router