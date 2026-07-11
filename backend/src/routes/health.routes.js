import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Backend de Farmacia Online funcionando correctamente"
  });
});

export default router;