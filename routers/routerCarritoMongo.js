const express = require("express")
const Carrito = require("../config/schemaCarritoMongoDb")
const {Producto}= require("../config/schemaProductosMongoDb")
const routerCarrito = express.Router()

const {CarritoDaoMongoDb}= require("../daos/carritos/carritoDaoMongoDb")
const carritoMongoDb= new CarritoDaoMongoDb()

//----------ROUTER CARRITO
//Devuelve todos los carritos creados
routerCarrito.get("/", (req,res ) => {
    const devolverCarrito = async() => {
        try{
            //mongodb
            const carritos= await carritoMongoDb.getAll()
            res.send(carritos)

        }catch(error){
            throw new Error(error)
        }
    }
    devolverCarrito()
})

//CREA UN NUEVO CARRITO
routerCarrito.post("/", (req,res) => {
    const creoCarrito = async() => {
        try{
            const objeto= {}
            objeto.timestamp= Date.now()
            objeto.productos=[]
           
            const carritoNuevo=await carritoMongoDb.saveCarrito(objeto)
            await carritoMongoDb.save(objeto)
            res.send(carritoNuevo)

        }catch(error){
            throw new Error(error)
        }
    }
    creoCarrito()
})

//AGREGA AL CARRITO, PRODUCTOS
routerCarrito.post("/:id/productos", (req,res) => {
    const agregarProductos = async() => {
        try{
            const idCarrito=req.params.id
            const idProducto= req.body.id
            await carritoMongoDb.addProductinCarrito(idCarrito,idProducto)
            const carrito=await carritoMongoDb.getById(idCarrito)
            res.send(carrito)
        }catch(error){
            throw new Error(error)
        }
    }
    agregarProductos()
})

//ELIMINA EL CARRITO POR SU ID
routerCarrito.delete("/:id", (req,res) => {
    const borrarCarrito = async() => {
        try{
            const borrado= await carritoMongoDb.deleteById(req.params.id)
            res.send(borrado)
        }catch(error){
            throw new Error(error)
        }
    }
    borrarCarrito()
})

//DEVUELVO TODOS LOS PRODUCTOS CARGADOS EN EL CARRITO(ID)
routerCarrito.get("/:id/productos", (req,res) => {
    const traerProductos = async() => {
        try{
            const id=req.params.id
            const products=await carritoMongoDb.getAllProductsByCarrito(id)
           res.send(products)

        }catch(error){
            throw new Error(error)
        }
    }
    traerProductos()
})

//BORRO EN EL CARRITO SELECCIONADO, EL PRODUCTO POR SU ID 
routerCarrito.delete("/:id/productos/:id_prod", (req,res) => {
    //Eliminar un producto del carrito por su id de carrito y de producto
    const eliminarProducto = async() => {
        try{
            const idCarrito=req.params.id
            const idProducto=req.params.id_prod
            const productosInCarrito=await carritoMongoDb.deleteProductInCarrito(idCarrito,idProducto)
            
            res.send(productosInCarrito)
        }catch(error){
            throw new Error(error)
        }
    }
    eliminarProducto()
})

routerCarrito.use((req,res)=> {
    res.send({ error : -2, descripcion: `RUTA: ${req.path}, metodo: ${req.method} no implementada`})
    
})

module.exports= {routerCarrito}