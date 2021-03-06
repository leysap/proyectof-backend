const express = require("express")
const routerProductos = express.Router()
const fs= require("fs")
// const Contenedor  = require("../clases/claseProducto")
// const claseContenedor = new Contenedor("productos.txt")
const middlewareAutenticacion = require("../middlewares/middlewareAutenticacion")
const middlewareAutorizacion = require("../middlewares/middlewareAutorizacion")

routerProductos.use(express.json());
routerProductos.use(express.urlencoded({ extended: true }));

const {ProductosDaoFile}= require("../daos/productos/productosDaoFile")
const productosFile= new ProductosDaoFile()

//FUNCIONES
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


//ROUTER PRODUCTOS
routerProductos.get("/" ,middlewareAutenticacion,async (req,res) => {
    const devolverProductos = async() => {
        try{
            await existeArchivo("productos.txt")
            const data = await productosFile.getAll()
            if(data.length == 0) return res.json("No se encuentran datos cargados")  
            else res.send(data)
        }catch(error){
            throw new Error(error)
        }
    }
    devolverProductos()
})
routerProductos.get("/:id",middlewareAutenticacion,async (req,res) => {
    const devolverProductos = async() => {
        try{
            await existeArchivo("productos.txt")
            const idProducto = parseInt(req.params.id);
            if(isNaN(idProducto)) return res.status(400).send({error: 'El parametro no es un numero'});
            const productoEncontrado = await productosFile.getById(idProducto)

            if(!productoEncontrado) res.status(404).send({error:'Producto no existente'})
            else res.send(productoEncontrado) 
        }catch(error){
            throw new Error(error)
        }
    }
    devolverProductos()
})

routerProductos.post("/",middlewareAutenticacion,middlewareAutorizacion, (req,res) => {    
    const agregarProducto = async() => {
        try{
            const productoNuevo= req.body
            const objeto=await productosFile.saveProduct(productoNuevo)
            await productosFile.save(objeto)
            res.send({objetoGuardado:objeto})
        }catch(error){
            throw new Error("ESTE ES EL ERROR:",error)
        }
    }
    agregarProducto()
})

routerProductos.put("/:id",middlewareAutenticacion,middlewareAutorizacion, (req,res) => {    
    const actualizarProduct = async() => {
        try{
            const idProducto=req.params.id
            const productoActualizar= req.body

            const productoAnterior = await productosFile.getById(idProducto)
            const productoActualizado=await productosFile.updateProductById(idProducto,productoActualizar)

            res.send({productoAnt: productoAnterior,productoActualizado: productoActualizado})
        }catch(error){
            throw new Error(error)
        }
    }
    actualizarProduct()
})

routerProductos.delete("/:id", middlewareAutenticacion,middlewareAutorizacion,(req,res) => {    
    const eliminarIdProducto = async() => {
        try{
            const idProducto = parseInt(req.params.id);
            //validacion
            if(isNaN(idProducto)) return res.status(400).send({error: 'El parametro no es un numero'});

            const productoEncontrado = await productosFile.getById(idProducto)

            if(!productoEncontrado) res.status(404).send({error:'Producto no encontrado'})
            else await productosFile.deleteById(idProducto)

            res.send({
                productoEliminado: productoEncontrado,
                numeroIdEliminado: idProducto
            })
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