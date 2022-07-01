

class ContenedorMemory{

    constructor(array){
        this.array= array
    }

    //save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
   async save(objeto){
    try{
        const miarray= await this.getAll()
        miarray.push(objeto)
        return objeto
        
    }catch(error){
        throw new Error(error)
    }  
   }


   // getById(Number): Object - Recibe un id y devuelve el objeto con ese id.
    async getById(id){
       try{
        let objetoId = this.array.find((x) => x.id == id);
        return objetoId

       }catch(error){
            throw new Error(error)
       }
   }

   // getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
   async getAll(){
    try{
       const array=this.array
       return array
    }catch(error){
        throw new Error(err);
    }
   }

   // deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
   async deleteById(id){
       try{
        let arrayFiltrado = this.array.filter((x) => x.id != id)
        const nuevoArray=this.array= arrayFiltrado
        return nuevoArray
       }catch(error){
        throw new Error(error)
    }
   }
   async updateProduct(idProduct,objeto){
        try{
            const contenido = await this.getAll()
            
            let idUno =idProduct-1; 
            const idDos = idProduct;

            const objetoEncontrado = contenido.find((x) => x.id == idDos)
            
            contenido[idUno].nombre = objeto.nombre
            contenido[idUno].timestamp = Date.now()
            contenido[idUno].descripcion = objeto.descripcion
            contenido[idUno].codigo = objeto.codigo
            contenido[idUno].stock = objeto.stock
            contenido[idUno].precio= objeto.precio
            contenido[idUno].foto = objeto.foto

            return objetoEncontrado
        }catch(error){
            throw new Error(error)
        }
    
    }

}

module.exports= {ContenedorMemory}