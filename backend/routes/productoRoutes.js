const express = require("express");
const Producto = require("../models/Producto");

const router = express.Router();

router.get("/", async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

router.post("/", async (req, res) => {
  const nuevoProducto = new Producto(req.body);
  await nuevoProducto.save();
  res.json({ status: "Producto guardado" });
});

router.delete("/:id", async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.json({ status: "Producto eliminado" });
});

module.exports = router;