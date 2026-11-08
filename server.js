require("dotenv").config();

const express = require("express");
const { initializeApp, cert } = require("firebase-admin/app");

const serviceAccount = require("./config/serviceAccountKey.json");

const app = express();
const PORT = process.env.PORT || 5000;

initializeApp({
    credential: cert(serviceAccount)
});

console.log("Firebase conectado correctamente");

app.get("/", (req, res) => {
    res.send("Servidor Express funcionando correctamente");
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});