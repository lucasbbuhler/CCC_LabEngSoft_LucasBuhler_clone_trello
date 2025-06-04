const express = require("express");
const router = express.Router();
const controller = require("../controllers/usuariosController");
const auth = require("../middlewares/authMiddleware");

router.use(auth);

router.get("/", controller.getUsuarios);
router.get("/:id", controller.getUsuarioPorId);
router.put("/:id", controller.atualizarUsuario);
router.delete("/:id", controller.deletarUsuario);
router.get("/email/:email", controller.getUsuarioPorEmail);



module.exports = router;
