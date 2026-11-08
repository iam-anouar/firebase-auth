
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Mostrar formulario de registro
router.get("/register", (req, res) => {
    res.render("register");
});

// Procesar registro
router.post("/register", authController.register);

// Mostrar formulario de inicio de sesión
router.get("/login", (req, res) => {
    res.render("login");
});

// Procesar inicio de sesión
router.post("/login", authController.login);

// Mostrar página principal
router.get("/home", authController.home);

// Cerrar sesión
router.get("/logout", authController.logout);

module.exports = router;
