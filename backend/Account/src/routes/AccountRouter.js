const AccountController = require("../controller/accountController")
const router = require("express").Router()


router.post("/register", AccountController.createAccount)
router.post("/login", AccountController.login)
router.get("/", AccountController.getAllAccounts)
router.get("/detail/:id", AccountController.getAccountById)
router.delete("/:id", AccountController.deleteAccount)
router.put("/:id", AccountController.updateAccount)

module.exports = router