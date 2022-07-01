const {ContenedorFile} = require("../../contenedores/contenedorFile")
const {ProductosDaoFile}= require("../../daos/productos/productosDaoFile")
const productosFile= new ProductosDaoFile()
const fs = require("fs");

class CarritoDaoFile extends ContenedorFile{
    constructor(){
        super("carrito.txt")
    }

    async saveCarrito(){
        try{
            let objeto= {}
            objeto.timestamp= Date.now()
            objeto.productos = []
            const contenido =await this.getAll()
            let longitud = contenido.length;
            let index = 0
            
                if (longitud == 0) {
                    index = 1;
                  } else {
                    //sumo uno al id del ultimo elemento y lo agrego al id del objeto
                    index = contenido[longitud - 1].id + 1;
                  }
                objeto.id = index
            return objeto
    
        }catch(error){
            throw error
        }  
       }
    async addProductInCarrito(idCarrito,idProducto){
        try{
            const contenido =await  this.getAll()

            // /ME TRAIGO EL CARRITO SELECCIONADO POR SU ID 
            const carritoEncontrado =  contenido.find(carrito => carrito.id == idCarrito)
            const misproductos= carritoEncontrado.productos

            //MI ARRAY DE PRODUCTOS
            const leerProductos = await productosFile.getAll()
            let objetoId = leerProductos.find((x) => x.id == idProducto);

            misproductos.push(objetoId)
            return contenido
    
        }catch(error){
            throw error
        }  
    }

    async saveInFile(contenido){
        try{
            await fs.promises.writeFile(this.fileName, JSON.stringify(contenido));
    
        }catch(error){
            throw error
        }  
    }

    async productsInCarrito(objeto){
        try{
            const products= objeto.productos
            return products
        }catch(error){
            throw error
        }  
    }

    async deleteProductInCarrito(idCarrito,idProducto){
        try{
            const contenido = await fs.promises.readFile(this.fileName)
            const contenidoParseado = JSON.parse(contenido)
            const carritoEncontrado=contenidoParseado.find(carrito => carrito.id == idCarrito)

            let carritoSinProd = await carritoEncontrado.productos.filter(prod => prod.id !== idProducto);
            carritoEncontrado.productos = carritoSinProd;
            await this.saveInFile(contenidoParseado)
            
        }catch(error){
            throw error
        }  
    }
}


module.exports={CarritoDaoFile}