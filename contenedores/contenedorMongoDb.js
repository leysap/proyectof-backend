//REVISARRRRRRRRRR
const mongoose= require("mongoose")
console.log(process.env.MONGO_DB)
mongoose.connect(process.env.MONGO_DB)
console.log("servidor levantado en mongo")

class ContenedorMongoDb {

    constructor(model){
        this.model=model

    }

    async save(objeto){
        try{
            await new this.model(objeto).save()
        }catch(error){
            throw error
        }  
    }

    async getById(id){
        try{
            const objetoEncontrado= await this.model.find({id: id})
            return objetoEncontrado
         
        }catch(error){
             throw error
        }
    }
 
    // getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
    async getAll(){
     try{
        let productos =await this.model.find()
        return productos

     }catch(error){
         console.log("Error en getAll: ", error)
     }
    }
 
    // deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
    async deleteById(id){
        try{
            let eliminandoProducto= await this.model.findOneAndDelete({id:id})
            return eliminandoProducto
        }catch(error){
         throw error
        }
    }

    async updateProductById(id,objeto){
        try{
           await this.model.updateOne({id:id}, {$set:{nombre:objeto.nombre, descripcion: objeto.descripcion, codigo:objeto.codigo, precio:objeto.precio, stock:objeto.stock, foto:objeto.foto, timestamp:new Date()}})
    
        }catch(error){
         throw error
        }
    }
    
   
}

module.exports={ContenedorMongoDb}