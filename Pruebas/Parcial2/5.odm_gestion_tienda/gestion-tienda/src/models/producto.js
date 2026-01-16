import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const productoSchema = new Schema(
  {
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    categoria: { type: String, required: true },
  },
  { timestamps: true, collection: 'productos' }
);

export const Producto = model('Producto', productoSchema);
