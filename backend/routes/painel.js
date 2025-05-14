const express = require("express");
const router = express.Router();
const controller = require("../controllers/painelController");
const auth = require("../middlewares/authMiddleware");

router.use(auth);

router.get("/", controller.getTodos);
router.get("/:id", controller.getPorId);
router.post("/", controller.criar);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.remover);

module.exports = router;
