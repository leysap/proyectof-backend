const express = require("express")
const app = express()
const dotenv= require("dotenv")
dotenv.config()

//ROUTERS:MONGO, FIREBASE, TXT,MEMORY
//DE ACUERDO AL MOTOR DE BASE DE DATOS SE VA DESCOMENTANDO PARA USARLO 

// const {routerProductos}= require("./routers/routerProductos")
// const {routerCarrito} = require("./routers/routerCarrito");
// const {routerProductos}= require("./routers/routerProductosMongoDb")
// const {routerCarrito}= require("./routers/routerCarritoMongo")
const{routerProductos}=require("./routers/firestore/routerProductosFirebase")
const{routerCarrito}=require("./routers/firestore/routerCarritoFirebase")
// const {routerProductos}= require("./routers/memory/routerProductsMemory")
// const {routerCarrito}= require("./routers/memory/routerCarritoMemory")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/producto", routerProductos)
app.use("/api/carrito", routerCarrito)

app.use((req,res,next) => {
    res.status(404).send({error: 'RUTA NO ENCONTRADA'});
})
app.listen(8080, () => {
    console.log("Server listening in PORT 8080")
})