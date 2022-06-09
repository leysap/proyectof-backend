const express= require("express")
const routerCarrito = express.Router()
const Carrito = require("../clases/claseCarrito")
const claseCarrito= new Carrito("carrito.txt")

const fs=require("fs")

//Funciones
const creandoArchivo = async (fileName) => {
    try {
       //Creo un nuevo archivo 
      await fs.promises.writeFile(fileName, "[]");
    } catch (error) {
      throw error;
    }
  };
const existeArchivo = async (fileName) => {
    //Chequeo que el archivo exista, si no existe creo uno nuevo
    const stats = fs.existsSync(fileName);
  
    if (stats == false) {
      console.log(`Creacion del archivo: ${fileName}`);
      await creandoArchivo(fileName);
    }
};

//ROUTER CARRITO
routerCarrito.get("/", (req,res ) => {
    const devolverCarrito = async() => {
        try{
            await existeArchivo("carrito.txt")
            const data= await claseCarrito.getAll()
            res.send({carritos: data})
        }catch(error){
            throw new Error(error)
        }
    }
    devolverCarrito()
})

routerCarrito.post("/", (req,res) => {
    const creoCarrito = async() => {
        try{
            await existeArchivo("carrito.txt")
            const carrito = await claseCarrito.save()
            res.send({carrito: carrito})
        }catch(error){
            throw new Error(error)
        }
    }
    creoCarrito()
})

routerCarrito.post("/:id/productos", (req,res) => {
    const agregarProductos = async() => {
        try{
            const idCarrito = parseInt(req.params.id)
            const idProducto = parseInt(req.body.id)
            //algunas validaciones
            if(isNaN(idCarrito)) return res.status(400).send({error: 'El parametro no es un numero'});
            if(isNaN(idProducto)) return res.status(400).send({error: 'El ID NO es un numero'});
            await claseCarrito.saveProductInCart(idCarrito,idProducto)
            res.send(`Producto ${idProducto} agregado al carrito ID: ${idCarrito}`)
        }catch(error){
            throw new Error(error)
        }
    }
    agregarProductos()
})

routerCarrito.delete("/:id", (req,res) => {
    const borrarCarrito = async() => {
        try{
            const idProducto = parseInt(req.params.id);
            if(isNaN(idProducto)) return res.status(400).send({error: 'El parametro no es un numero'});

            const data = await claseCarrito.getAll()
            const carritoEncontrado =  data.find(producto => producto.id == idProducto)

            if(!carritoEncontrado) return res.status(404).send({error:'Carrito no encontrado'})
            else await claseCarrito.deleteById(idProducto)

            res.send({carritoIdEliminado: idProducto})
        }catch(error){
            throw new Error(error)
        }
    }
    borrarCarrito()
})

routerCarrito.get("/:id/productos", (req,res) => {
    const traerProductos = async() => {
        try{
            const idCarrito = parseInt(req.params.id);
            if(isNaN(idCarrito)) return res.status(400).send({error: 'El parametro no es un numero'});

            const carritoEncontrado = await claseCarrito.getById(idCarrito)
            if(!carritoEncontrado) return res.status(404).send({error:'Carrito no encontrado'})

            res.send({productosEnCarrito: carritoEncontrado.productos})

        }catch(error){
            throw new Error(error)
        }
    }
    traerProductos()
})

routerCarrito.delete("/:id/productos/:id_prod", (req,res) => {
    //Eliminar un producto del carrito por su id de carrito y de producto
    const eliminarProducto = async() => {
        try{
            const idCarrito= parseInt(req.params.id)
            const idProducto= parseInt(req.params.id_prod)
            await claseCarrito.deleteProductInCarrito(idCarrito,idProducto)

            res.send(`Producto ${idProducto} eliminado exitosamente en el carrito ID: ${idCarrito}`)
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