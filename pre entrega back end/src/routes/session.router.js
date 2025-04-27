import { Router } from "express";
import userService from "../models/user.model.js";
import { isValidPassword } from "../utils.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  if (!first_name || !last_name || !email || !age || !password) {
    res.status(400).json({ message: "Faltan datos" });
    return;
  }
  try {
    const newUser = new userService({
      first_name,
      last_name,
      email,
      age,
      password,
    });
    await newUser.save();
    res.status(201).send({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(400).send({ message: "Error al registrar el usuario" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Faltan datos" });
      return;
    }
    const user = await userService.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Datos incorrectos" });
      return;
    }
    if (!isValidPassword(user, password)) {
      res.status(403).json({ message: "Datos incorrectos" });
      return;
    }
    const token = jwt.sign(
      { email: user.email, role: user.role },
      config.jwtPrivateKey,
      {
        expiresIn: config.jwtExpiresIn,
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.status(200).json({ message: "Inicio de sesion exitoso" });
  } catch (error) {
    res.status(400).send({ message: "Error al iniciar sesion" });
    console.log(error);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Haz cerrado sesión" });
});

export default router;
