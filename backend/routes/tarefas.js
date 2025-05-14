const express = require("express");
const router = express.Router();
const controller = require("../controllers/tarefasController");
const auth = require("../middlewares/authMiddleware");

router.use(auth);

router.get("/", controller.getTarefas);
router.get("/:id", controller.getTarefaPorId);
router.post("/", controller.criarTarefa);
router.put("/:id", controller.atualizarTarefa);
router.patch("/:id/concluir", controller.concluirTarefa);
router.delete("/:id", controller.removerTarefa);


module.exports = router;
