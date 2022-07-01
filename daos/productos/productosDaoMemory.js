const { ContenedorMemory } = require("../../contenedores/contenedorMemory");
const {arrayProducts}=require("../../config/arrayMemory")

class ProductosDaoMemory extends ContenedorMemory{
    constructor(){
        super(arrayProducts)
    }



    async saveProduct(objeto){
        try{
            const contenido = this.array
            let longitud = contenido.length;
            let index = 0
            
                if (longitud == 0) {
                    index = 1;
                  } else {
                    //sumo uno al id del ultimo elemento y lo agrego al id del objeto
                    index = contenido[longitud - 1].id + 1;
                  }
                
                objeto.id = index
                objeto.timestamp= Date.now()
                return objeto
        }catch(error){
            throw new Error(error)
        }  
       }
}

module.exports={ProductosDaoMemory}