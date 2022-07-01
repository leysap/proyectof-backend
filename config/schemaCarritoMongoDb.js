const mongoose =require("mongoose")

const carritoNuevo= mongoose.Schema({
    timestamp:{type:Date,require:true},
    id:{type:Number,require:true},
    productos:{type:Array,require:true}
})
const Carrito= mongoose.model("carrito", carritoNuevo)
module.exports= Carrito
