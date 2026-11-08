const { getAuth } = require("firebase-admin/auth");

// Registrar un usuario


const register = async (req, res) => {
    let email = "";

    try {
        email = (req.body.email || "").trim().toLowerCase();
        const password = req.body.password || "";

        // Validar que los campos no estén vacíos
        if (!email || !password) {
            return res.status(400).render("register", {
                error: "Debes completar todos los campos.",
                success: null,
                email
            });
        }

        // Validar el formato del correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).render("register", {
                error: "Introduce un correo electrónico válido.",
                success: null,
                email
            });
        }

        // Validar la longitud de la contraseña
        if (password.length < 6) {
            return res.status(400).render("register", {
                error: "La contraseña debe tener al menos 6 caracteres.",
                success: null,
                email
            });
        }

        // Crear usuario en Firebase
        const user = await getAuth().createUser({
            email,
            password
        });

        return res.status(201).render("register", {
            error: null,
            success: `Usuario ${user.email} registrado correctamente.`,
            email: ""
        });

    } catch (error) {
        console.error("Error al registrar:", error);

        // Distinguir los errores de Firebase
        if (error.code === "auth/email-already-exists") {
            return res.status(409).render("register", {
                error: "Este correo electrónico ya está registrado.",
                success: null,
                email
            });
        }

        if (error.code === "auth/invalid-email") {
            return res.status(400).render("register", {
                error: "El correo electrónico no es válido.",
                success: null,
                email
            });
        }

        // Otros errores
        return res.status(500).render("register", {
            error: "No se pudo completar el registro. Inténtalo de nuevo.",
            success: null,
            email
        });
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