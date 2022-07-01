
const {ContenedorMongoDb}= require("../../contenedores/contenedorMongoDb")
const Carrito= require("../../config/schemaCarritoMongoDb")
const {Producto}= require("../../config/schemaProductosMongoDb")

class CarritoDaoMongoDb extends ContenedorMongoDb{
    constructor(){
        super(Carrito)
    }

    async saveCarrito(objeto){
        try{
            const arrayCompleto= await this.getAll()
            let longitud = arrayCompleto.length;
            let index = 0
        
            if (longitud == 0) {
                index = 1;
              } else {
                //sumo uno al id del ultimo elemento y lo agrego al id del objeto
                index = arrayCompleto[longitud - 1].id + 1;
              }
            
            objeto.id = index
            return objeto
         
        }catch(error){
             throw error
        }
    }

    async deleteProductInCarrito(idCarrito,idProducto){
        try{
            const producto=  await this.model.findOne({id:idCarrito}, {productos:1, _id:0})
            const arrayDeProductos= producto.productos.filter((x) => x.id != idProducto)

            await this.model.findOneAndUpdate({id:idCarrito}, {$set: {productos: arrayDeProductos}})

            return arrayDeProductos

         
        }catch(error){
             throw error
        }
    }

    async getAllProductsByCarrito(id){
        try{

            const objetoEncontrado= await this.model.find({id:id}, {productos:1, _id:0})
            return objetoEncontrado
         
        }catch(error){
             throw error
        }
    }

    async addProductinCarrito(idCarrito,idProducto){
        try{
            const buscarenProducto= await Producto.findOne({id:idProducto})
            
            await this.model.findOneAndUpdate({id:idCarrito}, {$push: {productos: buscarenProducto}})
         
        }catch(error){
             throw error
        }
    }
}

module.exports={CarritoDaoMongoDb}