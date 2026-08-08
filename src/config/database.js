// La conexión a la base de datos se implementará en una próxima entrega.
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Error MongoDB");
  }
};
