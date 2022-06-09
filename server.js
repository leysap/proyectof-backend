const express = require("express")
const app = express()
const {routerProductos}= require("./routers/routerProductos")
const {routerCarrito} = require("./routers/routerCarrito")

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