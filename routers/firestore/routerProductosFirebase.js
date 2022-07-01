const express= require("express")
const routerProductos=express.Router()

const {ProductosDaoFirebase}= require("../../daos/productos/productosDaoFirebase")
const servidorFirebase= new ProductosDaoFirebase()

//PRODUCTOS
routerProductos.get("/" ,async (req,res) => {
    const devolverProductos = async() => {
        try{
            const datos= await servidorFirebase.getAll()
            res.send(datos)
            
        }catch(error){
            throw new Error(error)
        }
    }
    devolverProductos()
})

routerProductos.post("/", (req,res) => {    
        const agregarProducto = async() => {
            try{
                const product=await servidorFirebase.saveProduct(req.body)
                await servidorFirebase.save(product)
                
                res.send(product)
                
            }catch(error){
                throw new Error("este es el errorrrrrrr",error)
            }
        }
        agregarProducto()
    })

routerProductos.get("/:id",async (req,res) => {
    const devolverProductos = async() => {
            try{
                const objetoEncontrado= await servidorFirebase.getById(req.params.id)
                res.send({productoEncontrado: objetoEncontrado})

            }catch(error){
                    throw new Error(error)
            }
    }
        devolverProductos()
})


routerProductos.put("/:id", (req,res) => {    
    const actualizarProduct = async() => {
        try{
            const idProducto= (req.params.id).toString()
            const objetoActualizado= req.body
            await servidorFirebase.updateProductInFirebase(objetoActualizado,idProducto)
            const productoactualizado=await servidorFirebase.getById(idProducto)
            res.send(productoactualizado)

        }catch(error){
            throw new Error(error)
        }
    }
    actualizarProduct()
})

routerProductos.delete("/:id",(req,res) => {    
    const eliminarIdProducto = async() => {
        try{
            const idProducto= (req.params.id).toString()
            await servidorFirebase.deleteById(idProducto)
            res.send("Objeto eliminado")
        }catch(error){
            throw new Error(error)
        }
    }
    eliminarIdProducto()
})

module.exports= {routerProductos}