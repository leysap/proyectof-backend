const {ContenedorFirebase} = require("../../contenedores/contenedorFirebase")


class CarritoDaoFirebase extends ContenedorFirebase{

    constructor(){
        super("carrito")
    }

    async saveCarrito() {
        try {
            let objeto= {}
            objeto.timestamp= new Date()
            objeto.productos=[]
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

        } catch (err) {
            throw new Error(console.log(err))
        };
    };

    async productsInCarrito(objetoEncontrado) {
        try {
            const productosDeCarrito= objetoEncontrado.productos
            return productosDeCarrito

        } catch (err) {
            throw new Error(console.log(err))
        };
    };

    async updateProductInCarrito(id,array) {
        try {
            const doc= this.collection.doc(id.toString())
            await doc.update({productos:array})

        } catch (err) {
            throw new Error(console.log(err))
        };
    };

}

module.exports={CarritoDaoFirebase}