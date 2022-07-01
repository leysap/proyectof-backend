const express = require("express")
const routerCarrito= express.Router()
const {CarritoDaoFirebase}= require("../../daos/carritos/carritoDaoFirebase")

const servidorCarrito= new CarritoDaoFirebase()
const {ProductosDaoFirebase}= require("../../daos/productos/productosDaoFirebase")
const productosFirebase= new ProductosDaoFirebase()

//CARRITO
routerCarrito.get("/", (req,res ) => {
    const devolverCarrito = async() => {
        try{
            const array=await servidorCarrito.getAll()
            res.send(array)
           
        }catch(error){
            throw new Error(error)
        }
    }
    devolverCarrito()
})

routerCarrito.post("/", (req,res) => {
    const creoCarrito = async() => {
        try{
            const carritoNuevo=await servidorCarrito.saveCarrito()
            await servidorCarrito.save(carritoNuevo)
            res.send(carritoNuevo)

        }catch(error){
            throw new Error(error)
        }
    }
    creoCarrito()
})


//AGREGA AL CARRITO PRODUCTOS
routerCarrito.post("/:id/productos", (req,res) => {
    const agregarProductos = async() => {
        try{
            const idCarrito= req.params.id
            const carro= await servidorCarrito.getById(idCarrito)
            const array=carro.productos    

            const idProducto= req.body.id
            const productoEncontrado= await productosFirebase.getById(idProducto)
            array.push(productoEncontrado)
            // actualizar 
            const idCarritoString= idCarrito.toString()
            await servidorCarrito.updateProductInCarrito(idCarritoString,array)

            const productosInCarrito= await servidorCarrito.productsInCarrito(carro)
            res.send(productosInCarrito)
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
            const idProducto= (req.params.id).toString()
            await servidorCarrito.deleteById(idProducto)
            const carritos=await servidorCarrito.getAll()
            res.send(carritos)
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
            const idCarrito= req.params.id
            const carrito= await servidorCarrito.getById(idCarrito)
            const productosDeCarrito=await servidorCarrito.productsInCarrito(carrito)
            res.send(productosDeCarrito)
        }catch(error){
            throw new Error(error)
        }
    }
    traerProductos()
})

//BORRO EN EL CARRITO SELECCIONADO, EL PRODUCTO POR SU ID //ME FALTA ESTE
routerCarrito.delete("/:id/productos/:id_prod", (req,res) => {
    //Eliminar un producto del carrito por su id de carrito y de producto
    const eliminarProducto = async() => {
        try{
            const idCarrito= req.params.id
            const idProducto=req.params.id_prod
            const carritoEncontrado=await servidorCarrito.getById(idCarrito)
            //tengo mi array de productos
           const misProductos= await servidorCarrito.productsInCarrito(carritoEncontrado)
            const miArrayNuevo=misProductos.filter((x) => x.id != idProducto)
            //actualizar
            const idString= idCarrito.toString()
            await servidorCarrito.updateProductInCarrito(idString,miArrayNuevo)
            
            res.send(await servidorCarrito.getById(idCarrito))

        }catch(error){
            throw new Error(error)
        }
    }
    eliminarProducto()
})

module.exports= {routerCarrito}