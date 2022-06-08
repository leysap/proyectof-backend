const express = require("express")
const app = express()
const {routerProductos}= require("./routers/routerProductos")
const {routerCarrito} = require("./routers/routerCarrito")
// // const validarLogueado = require("./middlewares/validarLogueado")
// // const validarPermisos = require("./middlewares/validarPermiso")


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/producto", routerProductos)
app.use("/api/carrito", routerCarrito)
app.listen(8080, () => {
    console.log("Server listening in PORT 8080")
})

//middlewares
// const rutaget = (req,res,next) => {
//     console.log('Request Type:', req.method)
//     console.log('PATH:', req.path)

//     req.rutaget= "GET"
//     if(req.rutaget == req.method) next()
//     else res.json({ruta: "no permitido"})
//   }