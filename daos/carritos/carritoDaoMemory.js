const {ContenedorMemory} =require("../../contenedores/contenedorMemory")
const {arrayCarrito}=require("../../config/arrayMemory")


class CarritoDaoMemory extends ContenedorMemory{
    constructor(){
        super(arrayCarrito)
    }
    
    async saveCarrito(){
        try{
            let carrito={}
            carrito.timestamp= Date.now()
            carrito.productos=[]
            const contenido = this.array
            let longitud = contenido.length;
            let index = 0
            
                if (longitud == 0) {
                    index = 1;
                  } else {
                    //sumo uno al id del ultimo elemento y lo agrego al id del objeto
                    index = contenido[longitud - 1].id + 1;
                  }
                
                carrito.id = index

            return carrito

                    
        }catch(error){
            throw new Error(error)
        }  
    }

    async productsinCarrito(objeto){
        try{            
            const productos= objeto.productos
            return productos                    
        }catch(error){
            throw new Error(error)
        }  
    }
}


module.exports={CarritoDaoMemory}