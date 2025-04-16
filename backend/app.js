const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productoRoutes = require("./routes/productoRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/facturacion", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api/productos", productoRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});