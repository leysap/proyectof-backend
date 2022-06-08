const express = require("express")
const routerProductos = express.Router()
const moment = require("moment")
const fs= require("fs")
const Contenedor  = require("../clases")
const claseContenedor = new Contenedor("productos.txt")
const validarLogueado = require("../middlewares/validarLogueado")
const validarPermiso = require("../middlewares/validarPermiso")

routerProductos.use(express.json());
routerProductos.use(express.urlencoded({ extended: true }));

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
routerProductos.get("/" ,async (req,res) => {
    const devolverProductos = async() => {
        try{
            await existeArchivo("productos.txt")
            const data = await claseContenedor.getAll()
            if(data.length == 0) return res.json("no se encuentran datos cargados")  
            else res.json(data)
        }catch(error){
            throw new Error(error)
        }
    }
    devolverProductos()
})
routerProductos.get("/:id",async (req,res) => {
    const devolverProductos = async() => {
        try{
            const idProducto = parseInt(req.params.id);
            if(isNaN(idProducto)) return res.status(400).send({error: 'El parametro no es un numero'});
            const data = await claseContenedor.getAll()
            const productoEncontrado =  data.find(producto => producto.id == idProducto)
            if(!productoEncontrado) res.status(404).send({error:'Producto no existente'})
            else res.json(productoEncontrado)
        }catch(error){
            throw new Error(error)
        }
    }
    devolverProductos()
})

routerProductos.post("/",validarLogueado, validarPermiso(false), (req,res) => {    
    const agregarProducto = async() => {
        try{
            console.log(req.path)
            await existeArchivo("productos.txt")
            let obj = {};

            obj.timestamp = moment();
            obj.nombre = req.body.nombre;
            obj.descripcion = req.body.descripcion;
            obj.codigo = req.body.codigo;
            obj.precio = req.body.precio;
            obj.stock = req.body.stock;
            obj.foto = req.body.foto;

            // const objetoNuevo = req.body
            // console.log(objetoNuevo)
            // objetoNuevo.timestamp = Math.round(Date.now())
            // objetoNuevo.codigo = Math.floor(Math.random() * 100000)
            // console.log(objetoNuevo)
            await claseContenedor.save(obj)
            res.json(obj) 
        }catch(error){
            throw new Error(error)
        }
    }
    agregarProducto()
})

routerProductos.put("/:id", (req,res) => {    
    const actualizarProduct = async() => {
        try{
            const idProducto = parseInt(req.params.id -1);
            if(isNaN(idProducto)) return res.status(400).send({error: 'El parametro no es un numero'});
            const data = await claseContenedor.getAll()

            const idProd = parseInt(req.params.id);
            if(isNaN(idProd)) return res.status(400).send({error: 'El parametro no es un numero'})

            const objetoEncontrado = await claseContenedor.getById(idProd)
            if(!objetoEncontrado) return res.status(400).send({error: 'Producto no existente'})
            
            data[idProducto].nombre = req.body.nombre
            data[idProducto].timestamp = moment()
            data[idProducto].descripcion = req.body.descripcion
            data[idProducto].codigo = req.body.codigo
            data[idProducto].stock = req.body.stock
            data[idProducto].precio= req.body.precio
            data[idProducto].foto = req.body.foto

            await fs.promises.writeFile("productos.txt", JSON.stringify(data))

            res.json({
                objetoAnterior:objetoEncontrado,
                reemplazo: data[idProducto]
            })
            await claseContenedor.getAll()
        }catch(error){
            throw new Error(error)
        }
    }
    actualizarProduct()
})

routerProductos.delete("/:id", (req,res) => {    
    const eliminarIdProducto = async() => {
        try{
            const idProducto = parseInt(req.params.id);
            //validacion
            if(isNaN(idProducto)) return res.status(400).send({error: 'El parametro no es un numero'});

            const data = await claseContenedor.getAll()
            const productoEncontrado =  data.find(producto => producto.id == idProducto)

            if(!productoEncontrado) res.status(404).send({error:'Producto no encontrado'})
            else await claseContenedor.deleteById(idProducto)

            res.json({
                productoEliminado: productoEncontrado,
                numeroIdEliminado: idProducto
            })
        }catch(error){
            throw new Error(error)
        }
    }
    eliminarIdProducto()
})

module.exports= {routerProductos}