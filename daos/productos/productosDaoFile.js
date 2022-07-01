const {ContenedorFile}= require("../../contenedores/contenedorFile")


class ProductosDaoFile extends ContenedorFile{
    constructor(){
        super("productos.txt")
    }

    async saveProduct(objeto){
        try{
            const contenido =await this.getAll()
            let longitud = contenido.length;
            let index = 0
            
                if (longitud == 0) {
                    index = 1;
                  } else {
                    //sumo uno al id del ultimo elemento y lo agrego al id del objeto
                    index = contenido[longitud - 1].id + 1;
                  }
                
                objeto.timestamp= Date.now()
                objeto.id = index
                return objeto
    
        }catch(error){
            throw error
        }  
       }


}


module.exports={ProductosDaoFile}