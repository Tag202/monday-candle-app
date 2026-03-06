import { Router } from "express";
import * as controller from "../controllers/fragrance-controller";

const router = Router();

// GET /api/fragrances/
router.get("/", controller.getAll);

// GET /api/fragrances/1
router.get("/:id", controller.getOne);

// POST /api/fragrances/
router.post("/", controller.create);

// PUT /api/fragrances/1
router.put("/:id", controller.update);

// DELETE /api/fragrances/1
router.delete("/:id", controller.remove);

export default router;