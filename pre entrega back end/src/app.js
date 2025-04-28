// Importar los módulos necesarios
import session from "express-session";
import MongoStore from "connect-mongo";
import express from "express";
import handlebars from "express-handlebars";
import { __dirname, passportCall } from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";
import mongoose from "mongoose";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
// Obtener la URI de conexión de MongoDB desde las variables de entorno
const mongoURL = process.env.URI_MONGO;
// Obtener el puerto desde las variables de entorno, o usar 8080 por defecto
const port = process.env.PORT || 8080;

const app = express();

// Configuración de la sesión
app.use(
  session({
    store: MongoStore.create({
      // Usar la URI de conexión de MongoDB desde las variables de entorno
      mongoUrl: mongoURL,
      //   mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 600,
    }),
    secret: "secretPassword",
    resave: false,
    saveUninitialized: false,
  })
);

//COnfiguración de los middleware para trabajar con json desde formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la conexión a la base de datos
mongoose
  .connect(mongoURL)
  .then(() => {
    // Imprimir mensaje de éxito cuando se conecta a la base de datos
    console.log("Conectado a la base de datos");
  })
  .catch((error) => {
    // Imprimir mensaje de error si falla la conexión a la base de datos
    console.log(error);
  });

// Passport configuration
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//COnfiguración del motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Configuración de la carpeta pública
app.use(express.static("public"));

//Rutas
app.use(cookieParser());
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);

const server = app.listen(port, () => {
  // Imprimir mensaje cuando el servidor está corriendo
  console.log(`Server running on port ${port}`);
});


//Mensajes para el Jesús del futuro
// Recuerda agregar tu dirección IP a la lista blanca en MongoDB Atlas para que la aplicación pueda conectarse a la base de datos
// ¡Importante! Sin esto, la aplicación no podrá conectarse a la base de datos.
