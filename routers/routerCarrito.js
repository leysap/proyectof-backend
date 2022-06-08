const express= require("express")
const routerCarrito = express.Router()
const Contenedor  = require("../clases")
const claseCarrito = new Contenedor("carrito.txt")
const fs=require("fs")
const moment = require("moment")

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
        // CREO UN CARRITO Y LE DEVUELVO EL ID
        try{
            await existeArchivo("carrito.txt")
            // const datados= claseCarrito.getAll()
            const data = JSON.parse(fs.readFileSync("carrito.txt"))
            res.json({
                carritos: data
            })
        }catch(error){
            throw new Error(error)
        }
    }
    devolverCarrito()
})

routerCarrito.post("/", (req,res) => {
    const creoCarrito = async() => {
        // CREO UN CARRITO Y LE DEVUELVO EL ID
        try{
            await existeArchivo("carrito.txt")
            // const data = JSON.parse(fs.readFileSync("productos.txt"))
            const carritoObjeto= {
                timestamp: moment(),
                productos: []
            }
            const idasignado = await claseCarrito.save(carritoObjeto)
            console.log(idasignado)

            res.json({
                carritoID: idasignado
            })
        }catch(error){
            throw new Error(error)
        }
    }
    creoCarrito()
})
// "nombre": "gotas",
//     "descripcion": "descripcion del producto",
//     "codigo": 877,
//     "foto": "url/random",
//     "stock": 53,
//     "precio": 12
// AGREGAR PRODUCTOS AL CARRITO POR SU ID
routerCarrito.post("/:id/productos", (req,res) => {
    const agregarProductos = async() => {
        try{
            const idCarrito = parseInt(req.params.id)
            const idProducto = parseInt(req.body.id)

            //algunas validaciones
            if(isNaN(idCarrito)) return res.status(400).send({error: 'El parametro no es un numero'});
            if(isNaN(idProducto)) return res.status(400).send({error: 'El ID NO es un numero'});

            //ME TRAIGO EL CARRITO SELECCIONADO POR SU ID 
            const arrayparseado = JSON.parse(fs.readFileSync("carrito.txt"))
            const carritoEncontrado =  arrayparseado.find(carrito => carrito.id == idCarrito)
            const misproductos= carritoEncontrado.productos

            //MI ARRAY DE PRODUCTOS
            const leerProductos = JSON.parse(fs.readFileSync("productos.txt"))
            let objetoId = leerProductos.find((x) => x.id == idProducto);
            if(!objetoId) return res.json({error: "Producto no encontrado"})
            else misproductos.push(objetoId)

            console.log(misproductos)
            await fs.promises.writeFile("carrito.txt", JSON.stringify(arrayparseado));

            res.json(`Producto ID: ${objetoId.id} agregado al carrito ID:${idCarrito}`)
            // let longitud = misproductos.length
            // let index =0

            // const nuevoObjeto=req.body
            // if (longitud == 0) {
            //     index = 1;
            //   } else {
            //     //sumo uno al id del ultimo elemento y lo agrego al id del objeto
            //     index = misproductos[longitud - 1].id + 1;
            //   }

            // nuevoObjeto.id= index
            // nuevoObjeto.codigo= Math.floor(Math.random() * 100000)
            // nuevoObjeto.timestamp= Date.now()
            // misproductos.push(nuevoObjeto)
            // await fs.promises.writeFile("carrito.txt", JSON.stringify(arrayparseado));
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
            console.log(data)
            const productoEncontrado =  data.find(producto => producto.id == idProducto)
            if(!productoEncontrado) res.status(404).send({error:'Producto no encontrado'})
            else await claseCarrito.deleteById(idProducto)
            res.json({
                numeroIdEliminado: idProducto
            })
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
            const data = await claseCarrito.getAll()
            const carritoEncontrado =  data.find(carrito => carrito.id == idCarrito)
            if(!carritoEncontrado) return res.status(404).send({error:'Carrito no encontrado'})
            res.json({
                productosEnCarrito: carritoEncontrado.productos
            })
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

            //algunas validaciones
            if(isNaN(idCarrito)) return res.status(400).send({error: 'El parametro del carrito no es un numero'});
            if(isNaN(idProducto)) return res.status(400).send({error: 'El parametro del producto no es un numero'});

            //buscamos el carrito con el ID
            const arrayparseado = await claseCarrito.getAll()
            const carritoEncontrado =  arrayparseado.find(carrito => carrito.id == idCarrito)
            if(!carritoEncontrado) return res.status(404).send({error:'Carrito no encontrado'})

            //traemos el array de productos-objetos
            const productos = carritoEncontrado.productos

            //Vamos a encontrar el producto a eliminar
            const objetoEliminar = productos.find(producto => producto.id == idProducto)
            if(!objetoEliminar) return res.status(404).send({error:'Producto no encontrado'})

            //Eliminamos el producto del array de productos
            const arrayConProductoEliminado = productos.filter((x) => x.id !== objetoEliminar.id)

            //actualizamos los productos
            carritoEncontrado.productos = arrayConProductoEliminado
            await fs.promises.writeFile("carrito.txt", JSON.stringify(arrayparseado))

            res.json(
                    "eliminado exitosamente"
                )
        }catch(error){
            throw new Error(error)
        }
    }
    eliminarProducto()
})

routerCarrito.use((req,res)=> {
    res.send(`ERROR ${req.method} NO AUTORIZADO`)
})

module.exports= {routerCarrito}