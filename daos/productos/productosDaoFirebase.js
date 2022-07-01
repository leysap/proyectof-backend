const {ContenedorFirebase}=require("../../contenedores/contenedorFirebase")

class ProductosDaoFirebase extends ContenedorFirebase{
  
    constructor(){
        super("productos")
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
            objeto.timestamp= new Date()
            return objeto
        }catch(error){
            throw error
        }  
    }  
}
module.exports= {ProductosDaoFirebase}