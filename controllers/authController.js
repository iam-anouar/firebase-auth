const { getAuth } = require("firebase-admin/auth");

// Registrar un usuario
const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await getAuth().createUser({
            email: email,
            password: password
        });

        res.send(`Usuario registrado correctamente: ${user.email}`);

    } catch (error) {
        console.error("Error al registrar:", error);
        res.status(400).send("Error al registrar el usuario");
    }
};

// Iniciar sesión
const login = async (req, res) => {
    try {
        const { idToken } = req.body;

        const decodedToken = await getAuth().verifyIdToken(idToken);

        req.session.user = {
            uid: decodedToken.uid,
            email: decodedToken.email
        };

        res.json({ success: true });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(401).json({
            success: false,
            message: "Credenciales no válidas"
        });
    }
};

// Mostrar página principal
const home = (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.render("home", {
        user: req.session.user
    });
};

// Cerrar sesión
const logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).send("Error al cerrar sesión");
        }

        res.redirect("/login");
    });
};


module.exports = {
    register,
    login,
    home,
    logout
};