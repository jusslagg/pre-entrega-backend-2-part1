import mongoose from 'mongoose';

const userCollection = "gamesphere";

// Definir el esquema para el usuario
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' },
    role: { type: String, default: 'user' }
});

let UserModel;
try {
    UserModel = mongoose.model(userCollection, userSchema);
} catch (error) {
    console.error("Error creating UserModel:", error);
}

export default UserModel;
