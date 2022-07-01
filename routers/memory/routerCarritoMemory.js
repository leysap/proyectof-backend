const express= require("express")
const routerCarrito = express.Router()

routerCarrito.use(express.json());
routerCarrito.use(express.urlencoded({ extended: true }));

const {CarritoDaoMemory} = require("../../daos/carritos/carritoDaoMemory")
const carritoMemory= new CarritoDaoMemory()
const {ProductosDaoMemory}= require("../../daos/productos/productosDaoMemory")
const productoMemory=new ProductosDaoMemory()

//----------ROUTER CARRITO
//Devuelve todos los carritos creados
routerCarrito.get("/", (req,res ) => {
    const devolverCarrito = async() => {
        try{
           const arrayCarritos= await carritoMemory.getAll()
           res.send(arrayCarritos)
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
            const carrito=await carritoMemory.saveCarrito()
            await carritoMemory.save(carrito)
            res.send(carrito)
            
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
            const idCarrito= req.params.id
            const idProducto= req.body.id

            //me traigo el carrito y los productos de ese carrito
            let carrito=await carritoMemory.getById(idCarrito)
            const productos=await carritoMemory.productsinCarrito(carrito)

            let productoFind= await productoMemory.getById(idProducto) 
            let pushearObjetos=productos.push(productoFind)
            arrayProductos=pushearObjetos
            await carritoMemory.productsinCarrito(idCarrito)

            res.send(await carritoMemory.getById(idCarrito))
            
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
            await carritoMemory.deleteById(req.params.id)
            res.send(await carritoMemory.getAll())
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
            const carrito=await carritoMemory.getById(idCarrito)
            const carritoProductos=carrito.productos
            res.send(carritoProductos)
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
            const idCarrito= parseInt(req.params.id)
            const idProducto= parseInt(req.params.id_prod)

            let array= await carritoMemory.getAll()
            let carritoFind= array.find((x) =>x.id ==idCarrito)

            carritoFind.productos=carritoFind.productos.filter((x) => x.id != idProducto)

            carritoFind["id"] = idCarrito;
            array[idCarrito-1] = carritoFind;
            res.send(await carritoMemory.getById(idCarrito))
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