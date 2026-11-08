
require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");





const app = express();

// Cargar las credenciales desde .env
const serviceAccount = require(
    path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS)
);

// Inicializar Firebase Admin
const firebaseApp = initializeApp({
    credential: cert(serviceAccount)
});

console.log("Firebase conectado correctamente");



const PORT = process.env.PORT || 5000;

// Configurar EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Permitir recibir datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    }
}));

// Importar rutas de autenticación
const authRoutes = require("./routes/authRoutes");

// Utilizar las rutas
app.use("/", authRoutes);

// Ruta principal
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
