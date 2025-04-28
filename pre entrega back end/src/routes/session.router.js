import { Router } from "express";
import userModel from "../models/user.model.js";
import { createHash, generateToken, passportCall } from "../utils.js";
import passport from "passport";

const router = Router();

//ruta para obtener los datos de la cookie del usuario autenticado
router.get(
  "/current",
  passportCall("current", { session: false }),
  (req, res) => {
    res.render("current", {
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      password: req.user.password,
      cart: req.session.user.cart,
      __v: req.user.__v,
      iat: req.user.iat,
      exp: req.user.exp,
      role: req.user.role,
    });
  }
);

//ruta de registro
router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/fail-register",
  }),
  async (req, res) => {
    try {
      console.log("Usuario registrado");
      res.redirect("/login");
    } catch (error) {
      console.log("Error al registrar el usuario: ", error);
      res.status(500).send("Error al registrar el usuario");
    }
  }
);

//ruta de login
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/fail-login" }),
  async (req, res) => {
    try {
      const accessToken = generateToken(req.user.toObject());
      res.cookie("tokenCookie", accessToken, {
        httpOnly: true,
        maxAge: 60000,
      });
      req.session.user = req.user;
      res.redirect("/profile");
    } catch (error) {
      console.log("Error al iniciar sesión: ", error);
      res.status(500).send("Error al iniciar sesión");
    }
  }
);

//ruta de logout
router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log("Error al cerrar sesión: ", error);
      res.status(500).send("Error al cerrar sesión");
    } else {
      res.redirect("/login");
    }
  });
});

//ruta de restaurar contraseña
router.post("/restore-password", async (req, res) => {
  const { email, password, repeat_password } = req.body;
  if (!email || !password || !repeat_password) {
    return res.status(400).send("Todos los campos son obligatorios");
  }
  if (password !== repeat_password) {
    return res.status(400).send("Las contraseñas no coinciden");
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send("Usuario no encontrado");
    }
    user.password = createHash(password);
    await user.save();
    res.redirect("/login");
  } catch (error) {
    res.status(500).send("Error al restaurar contraseña");
  }
});

export default router;
