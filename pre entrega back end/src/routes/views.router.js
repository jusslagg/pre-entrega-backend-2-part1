import { Router } from "express";
import { isLoggedIn, isLoggedOut } from "../middlewares/auth.js";

const router = Router();

//Si existe una sesión iniciada muestra la pantalla de bienvenida, si no redirige al login
router.get("/", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    res.render("welcome", {
      first_name: req.session.user.first_name,
      last_name: req.session.user.last_name,
    });
  } catch (error) {
    console.error(error); // opcional: loggear el error
    res.status(500).send("No hay usuario autenticado");
  }
});

//Ruta de pantalla de login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("login");
});

router.get("/fail-login", (req, res) => {
  res.send("Error al iniciar sesión");
});

//Ruta de pantalla de registro
router.get("/register", isLoggedOut, (req, res) => {
  res.render("register");
});

router.get("/fail-register", (req, res) => {
  res.send("Error al registrar el usuario");
});

//Ruta de pantalla de restaurar contraseña
router.get("/restore-password", (req, res) => {
  res.render("restore");
});

//Ruta de pantalla de perfil
router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", {
    first_name: req.session.user.first_name,
    last_name: req.session.user.last_name,
    email: req.session.user.email,
    age: req.session.user.age,
    cart: req.session.user.cart,
    role: req.session.user.role,
  });
});

export default router;
