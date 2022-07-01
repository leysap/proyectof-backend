const express = require("express")
const routerProductos = express.Router()
const middlewareAutenticacion = require("../middlewares/middlewareAutenticacion")
const middlewareAutorizacion = require("../middlewares/middlewareAutorizacion")

const {ProductosDaoMongoDb}= require("../daos/productos/productosDaoMongoDb")
const productosMongo= new ProductosDaoMongoDb()

routerProductos.use(express.json());
routerProductos.use(express.urlencoded({ extended: true }));

//ROUTER PRODUCTOS MONGO
routerProductos.get("/" ,middlewareAutenticacion,async (req,res) => {
    const devolverProductos = async() => {
        try{
            const productosArray=await productosMongo.getAll()
            res.send(productosArray)

        }catch(error){
            throw new Error(error)
        }
    }
    devolverProductos()
})
routerProductos.get("/:id",middlewareAutenticacion,async (req,res) => {
    const devolverProductos = async() => {
        try{
            const objetoEncontrado= await productosMongo.getById(req.params.id)
            res.send(objetoEncontrado)
            
        }catch(error){
            throw new Error(error)
        }
    }
    devolverProductos()
})

routerProductos.post("/",middlewareAutenticacion,middlewareAutorizacion, (req,res) => {    
    const agregarProducto = async() => {
        try{
            const objetoNuevo = req.body
            objetoNuevo.timestamp= new Date()

            const objeto= await productosMongo.saveProduct(objetoNuevo)
            await productosMongo.save(objeto)

            res.send(objeto) 
        }catch(error){
            throw new Error(error)
        }
    }
    agregarProducto()
})

routerProductos.put("/:id",middlewareAutenticacion,middlewareAutorizacion, (req,res) => {    
    const actualizarProduct = async() => {
        try{
            const idProducto= req.params.id
            const objeto=req.body
            
            await productosMongo.updateProductById(idProducto,objeto)

            const productoActualizado=await productosMongo.getById(idProducto)
            res.send(productoActualizado)

        }catch(error){
            throw new Error(error)
        }
    }
    actualizarProduct()
})

routerProductos.delete("/:id", middlewareAutenticacion,middlewareAutorizacion,(req,res) => {    
    const eliminarIdProducto = async() => {
        try{
            const objetoEliminado= await productosMongo.deleteById(req.params.id)
            res.send({objetoEliminado})

        }catch(error){
            throw new Error(error)
        }
    }
    eliminarIdProducto()
})

routerProductos.use((req,res)=> {
    res.send({ error : -2, descripcion: `RUTA: ${req.path}, metodo: ${req.method} no implementada`})
    
})

module.exports= {routerProductos}