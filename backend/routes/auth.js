const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");

router.post("/login", controller.login);
router.post("/register", controller.register);
router.post("/recuperar-senha", controller.recuperarSenha);
router.post("/resetar-senha", controller.resetarSenha);

module.exports = router;
