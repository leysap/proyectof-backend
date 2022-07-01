const mongoose =require("mongoose")

//DEFINO MI SCHEMA 
const productoNuevo = new mongoose.Schema({
    nombre:{type: String, require:true},
    descripcion:{type: String, require:true},
    codigo:{type: Number,require:true},
    precio:{type:Number,require:true},
    stock:{type:Number,require:true},
    foto:{type:String,require:true},
    timestamp:{type:Date,require:true},
    id:{type:Number,require:true}
})

//DEFINO EL MODELO
const Producto = mongoose.model("producto", productoNuevo)

module.exports={Producto}


