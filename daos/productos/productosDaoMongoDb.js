
const {ContenedorMongoDb}= require("../../contenedores/contenedorMongoDb")
const {Producto}= require("../../config/schemaProductosMongoDb")

class ProductosDaoMongoDb extends ContenedorMongoDb{
    constructor(){
        super(Producto)
    }

    async saveProduct(objeto){
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
            throw new Error(error)
        }  
    }
 
   
}

module.exports={ProductosDaoMongoDb}