const express= require("express")
const routerProductos = express.Router()

const middlewareAutenticacion = require("../../middlewares/middlewareAutenticacion")
const middlewareAutorizacion = require("../../middlewares/middlewareAutorizacion")

routerProductos.use(express.json());
routerProductos.use(express.urlencoded({ extended: true }));

const {ProductosDaoMemory} = require("../../daos/productos/productosDaoMemory")
const productsMemory= new ProductosDaoMemory()


//ROUTER PRODUCTOS
routerProductos.get("/" ,middlewareAutenticacion,async (req,res) => {
    const devolverProductos = async() => {
        try{
            const productos= await productsMemory.getAll()
            res.send(productos)
        }catch(error){
            throw new Error(error)
        }
    }
    devolverProductos()
})

routerProductos.get("/:id",middlewareAutenticacion,async (req,res) => {
    const devolverProductos = async() => {
        try{
            const idProducto= req.params.id
            const objetoEncontrado=await productsMemory.getById(idProducto)
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
            const nuevoObjeto= req.body
            const objetoNuevo=await productsMemory.saveProduct(nuevoObjeto)
            await productsMemory.save(objetoNuevo)
            res.send(objetoNuevo)
            
        }catch(error){
            throw new Error("ESTE ES EL ERROR:",error)
        }
    }
    agregarProducto()
})

routerProductos.put("/:id",middlewareAutenticacion,middlewareAutorizacion, (req,res) => {    
    const actualizarProduct = async() => {
        try{
            const idProduct= req.params.id
            const objetoNuevo=req.body

            const objetoEncontrado=await productsMemory.updateProduct(idProduct,objetoNuevo)
            res.send(objetoEncontrado)

        }catch(error){
            throw new Error(error)
        }
    }
    actualizarProduct()
})

routerProductos.delete("/:id", middlewareAutenticacion,middlewareAutorizacion,(req,res) => {    
    const eliminarIdProducto = async() => {
        try{
            const idProducto= req.params.id
            const arrayNuevo=await productsMemory.deleteById(idProducto)
            res.send(arrayNuevo)
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