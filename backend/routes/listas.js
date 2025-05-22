const express = require("express");
const router = express.Router();
const controller = require("../controllers/listasController");
const auth = require("../middlewares/authMiddleware");

router.use(auth);

router.get("/", controller.getTodas);
router.get("/:id", controller.getPorId);
router.get("/painel/:painel_id", controller.getPorPainel);
router.post("/", controller.criar);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.remover);
router.patch("/:id/posicao", controller.atualizarPosicao);

module.exports = router;
