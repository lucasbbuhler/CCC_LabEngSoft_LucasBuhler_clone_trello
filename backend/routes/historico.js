const express = require("express");
const router = express.Router();
const controller = require("../controllers/historicoController");
const auth = require("../middlewares/authMiddleware");

router.use(auth);

router.get("/tarefa/:tarefa_id", controller.getPorTarefa);
router.post("/", controller.criar);

module.exports = router;
