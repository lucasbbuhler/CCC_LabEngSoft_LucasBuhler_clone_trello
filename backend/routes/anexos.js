const express = require("express");
const router = express.Router();
const controller = require("../controllers/anexosController");
const auth = require("../middlewares/authMiddleware");

router.use(auth);

router.get("/tarefa/:tarefa_id", controller.getPorTarefa);
router.post("/", controller.criar);
router.delete("/:id", controller.remover);

module.exports = router;
