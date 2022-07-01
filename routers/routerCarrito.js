const express= require("express")
const routerCarrito = express.Router()
const fs=require("fs")

const {CarritoDaoFile} = require("../daos/carritos/carritoDaoFile")
const carritoFile= new CarritoDaoFile()

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

//----------ROUTER CARRITO
//Devuelve todos los carritos creados
routerCarrito.get("/", (req,res ) => {
    const devolverCarrito = async() => {
        try{
            await existeArchivo("carrito.txt")
            const data= await carritoFile.getAll()
            res.send(data)
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
            await existeArchivo("carrito.txt")
            const carrito = await carritoFile.saveCarrito()
            await carritoFile.save(carrito)
            res.send({carrito: carrito})
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
            const idCarrito = parseInt(req.params.id)
            const idProducto = parseInt(req.body.id)
            //algunas validaciones
            if(isNaN(idCarrito)) return res.status(400).send({error: 'El parametro no es un numero'});
            if(isNaN(idProducto)) return res.status(400).send({error: 'El ID NO es un numero'});
            
            const contenido=await carritoFile.addProductInCarrito(idCarrito,idProducto)          
            await carritoFile.saveInFile(contenido)
            
            const carritoID=await carritoFile.getById(idCarrito)
            const productInCarrito=await carritoFile.productsInCarrito(carritoID)
            res.send(productInCarrito)
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
            const idCarrito = parseInt(req.params.id);
            if(isNaN(idCarrito)) return res.status(400).send({error: 'El parametro no es un numero'});
            const data = await carritoFile.getAll()
            const carritoEncontrado =  data.find(producto => producto.id == idCarrito)

            if(!carritoEncontrado) return res.status(404).send({error:'Carrito no encontrado'})
            else await carritoFile.deleteById(idCarrito)

            res.send(await carritoFile.getAll())
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
            const idCarrito = parseInt(req.params.id);
            if(isNaN(idCarrito)) return res.status(400).send({error: 'El parametro no es un numero'});

            const carritoEncontrado = await carritoFile.getById(idCarrito)
            const products=await carritoFile.productsInCarrito(carritoEncontrado)
            if(!carritoEncontrado) return res.status(404).send({error:'Carrito no encontrado'})

            res.send({productosEnCarrito: products})

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
            await carritoFile.deleteProductInCarrito(idCarrito,idProducto)
    
            res.send(await carritoFile.getById(idCarrito))
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