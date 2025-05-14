const express = require("express");
const router = express.Router();
const controller = require("../controllers/membrosPainelController");
const auth = require("../middlewares/authMiddleware");

router.use(auth);

router.get("/:painel_id", controller.listarMembros);
router.post("/", controller.adicionarMembro);
router.delete("/:usuario_id/:painel_id", controller.removerMembro);

module.exports = router;
