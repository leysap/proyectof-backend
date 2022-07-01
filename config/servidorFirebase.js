const express = require("express")
const app = express()
const dotenv= require("dotenv")
dotenv.config()

const admin = require("firebase-admin");
const serviceAccount = require("../backend-proyect.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://backend-proyect.firebaseio.com"
});

const db = admin.firestore() 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/producto", routerProductos)
app.use("/api/carrito", routerCarrito)

app.use((req,res,next) => {
    res.status(404).send({error: 'RUTA NO ENCONTRADA'});
})
app.listen(8080, () => {
    console.log("Server listening in PORT 8080")
})
// const express = require("express")
// const app = express()
// const routerProductos = express.Router()
// const routerCarrito= express.Router()
// const {ProductosDaoFirebase}= require("../daos/productos/productosDaoFirebase")
// const {CarritoDaoFirebase}= require("../daos/carritos/carritoDaoFirebase")

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const admin = require("firebase-admin");
// const serviceAccount = require("../backend-proyect.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://backend-proyect.firebaseio.com"
// });

// const db = admin.firestore() 

// const productos= db.collection("productos")
// const carrito= db.collection("carrito")

// const servidorFirebase= new ProductosDaoFirebase(productos)
// const servidorCarrito= new CarritoDaoFirebase(carrito)

// app.use("/api/producto", routerProductos)
// app.use("/api/carrito", routerCarrito)

// app.use((req,res,next) => {
//     res.status(404).send({error: 'RUTA NO ENCONTRADA'});
// })
// app.listen(8080, () => {
//     console.log("Server listening in PORT 8080")
// })

// module.exports={db}
// //PRODUCTOS
// routerProductos.get("/" ,async (req,res) => {
//     const devolverProductos = async() => {
//         try{
//             const datos= await servidorFirebase.getAll()
//             res.send(datos)
            
//         }catch(error){
//             throw new Error(error)
//         }
//     }
//     devolverProductos()
// })

// routerProductos.post("/", (req,res) => {    
//         const agregarProducto = async() => {
//             try{
//                 //firebase 
//                 await servidorFirebase.saveProductInFirebase(req.body)
//                 res.send("objeto guardao")
                
                
//             }catch(error){
//                 throw new Error("este es el errorrrrrrr",error)
//             }
//         }
//         agregarProducto()
//     })

    
// routerProductos.get("/:id",async (req,res) => {
//     const devolverProductos = async() => {
//             try{
//                 const objetoEncontrado= await servidorFirebase.getById(req.params.id)
//                 res.send({productoEncontrado: objetoEncontrado})

//             }catch(error){
//                     throw new Error(error)
//             }
//     }
//         devolverProductos()
// })


// routerProductos.put("/:id", (req,res) => {    
//     const actualizarProduct = async() => {
//         try{
//             const idProducto= (req.params.id).toString()
//             const objetoActualizado= req.body
//             await servidorFirebase.updateProductInFirebase(objetoActualizado,idProducto)
//             res.send("objeto actualizado")

//         }catch(error){
//             throw new Error(error)
//         }
//     }
//     actualizarProduct()
// })

// routerProductos.delete("/:id",(req,res) => {    
//     const eliminarIdProducto = async() => {
//         try{

//             const idProducto= (req.params.id).toString()
//             await servidorFirebase.deleteById(idProducto)
//             res.send("objeto Eliminado")

//         }catch(error){
//             throw new Error(error)
//         }
//     }
//     eliminarIdProducto()
// })


// //CARRITO
// routerCarrito.get("/", (req,res ) => {
//     const devolverCarrito = async() => {
//         try{
//             const array=await servidorCarrito.getAll()
//             res.send(array)
           
//         }catch(error){
//             throw new Error(error)
//         }
//     }
//     devolverCarrito()
// })

// routerCarrito.post("/", (req,res) => {
//     const creoCarrito = async() => {
//         try{
//             let objeto= {}
//             objeto.timestamp= new Date()
//             objeto.productos=[]
//             const objetoCarrito=await servidorCarrito.save(objeto)
//             const carritoIdString= objetoCarrito.id.toString()
//             let doc = carrito.doc(carritoIdString);
//             await doc.create(objeto);
//             res.send("carrito nuevo creado y guardado")

//         }catch(error){
//             throw new Error(error)
//         }
//     }
//     creoCarrito()
// })


// //AGREGA AL CARRITO PRODUCTOS
// routerCarrito.post("/:id/productos", (req,res) => {
//     const agregarProductos = async() => {
//         try{
//             const idCarrito= req.params.id
//             const carro= await servidorCarrito.getById(idCarrito)
//             const array=carro.productos
            
//             const products=await servidorFirebase.getAll()

//             const idProducto= req.body.id
//             const productoEncontrado= products.find((x) => x.id == idProducto)
//             array.push(productoEncontrado)
//             //actualizar 
//             const doc= carrito.doc(idCarrito.toString())
//             await doc.update({productos: array})

//             res.send("producto agregado")
//         }catch(error){
//             throw new Error(error)
//         }
//     }
//     agregarProductos()
// })


// //ELIMINA EL CARRITO POR SU ID
// routerCarrito.delete("/:id", (req,res) => {
//     const borrarCarrito = async() => {
//         try{
//             const idProducto= (req.params.id).toString()
//             await servidorCarrito.deleteById(idProducto)
//             res.send("carrito eliminado")
//         }catch(error){
//             throw new Error(error)
//         }
//     }
//     borrarCarrito()
// })

// //DEVUELVO TODOS LOS PRODUCTOS CARGADOS EN EL CARRITO(ID)
// routerCarrito.get("/:id/productos", (req,res) => {
//     const traerProductos = async() => {
//         try{
//             const idCarrito= req.params.id
//             const objetoEncontrado=await servidorCarrito.getById(idCarrito)
//             const productosDeCarrito= objetoEncontrado.productos
//             res.send(productosDeCarrito)
//         }catch(error){
//             throw new Error(error)
//         }
//     }
//     traerProductos()
// })

// //BORRO EN EL CARRITO SELECCIONADO, EL PRODUCTO POR SU ID //ME FALTA ESTE
// routerCarrito.delete("/:id/productos/:id_prod", (req,res) => {
//     //Eliminar un producto del carrito por su id de carrito y de producto
//     const eliminarProducto = async() => {
//         try{
//             const idCarrito= req.params.id
//             const idProducto=req.params.id_prod
//             const carritoEncontrado=await servidorCarrito.getById(idCarrito)
//             //tengo mi array de productos
//             const misProductos= carritoEncontrado.productos
//             const miArrayNuevo=misProductos.filter((x) => x.id != idProducto)
//             //actualizar
//             const doc= carrito.doc(idCarrito.toString())
//             await doc.update({productos: miArrayNuevo})
//             res.send("producto eliminado")

//         }catch(error){
//             throw new Error(error)
//         }
//     }
//     eliminarProducto()
// })
