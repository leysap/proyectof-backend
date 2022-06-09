const fs = require("fs");

const creandoArchivo = async (fileName) => {
    try {
       //Creo un nuevo archivo 
      await fs.promises.writeFile(fileName, "[]");
    } catch (error) {
      throw error;
    }
  };

  const existeArchivo = async (fileName) => {
    //Chequeo que el archivo exista, si no existe creo uno nuevo
    const stats = fs.existsSync(fileName);
  
    if (stats == false) {
      console.log(`Creacion del archivo: ${fileName}`);
      await creandoArchivo(fileName);
    }
  };
  
class Carrito{

    constructor(fileName){
        this.fileName= fileName
    }

    //save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
   async save(){
    try{
        await existeArchivo(this.fileName)
        let objeto= {}
        const contenido = JSON.parse(await fs.promises.readFile(this.fileName))
        objeto.timestamp= Date.now()
        objeto.productos = []
        let longitud = contenido.length;
        let index = 0
        objeto.id= index
        
            if (longitud == 0) {
                index = 1;
              } else {
                //sumo uno al id del ultimo elemento y lo agrego al id del objeto
                index = contenido[longitud - 1].id + 1;
              }
            
            objeto.id = index
            contenido.push(objeto)
            await fs.promises.writeFile(this.fileName, JSON.stringify(contenido));
            return objeto.id
            // return objeto.id

    }catch(error){
        throw error
    }  
   }

   // getById(Number): Object - Recibe un id y devuelve el objeto con ese id.
    async getById(id){
       try{
        const contenido = await fs.promises.readFile(this.fileName)
        const objeto = JSON.parse(contenido)

        let objetoId = objeto.find((x) => x.id == id);
        
        return objetoId;
        
       }catch(error){
            throw error
       }
   }

   // getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
   async getAll(){
        try{
            await existeArchivo(this.fileName)

            const contenidoCrudo = await fs.promises.readFile(this.fileName)
            const contenido = JSON.parse(contenidoCrudo)
            return contenido;
        }catch(error){
            console.log("Error en getAll: ", error)
            return [];
        }
   }

   // deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
   async deleteById(id){
       try{
        const contenido = await fs.promises.readFile(this.fileName)
        const contenidoParseado = JSON.parse(contenido)
        
        let arrayFiltrado = contenidoParseado.filter((x) => x.id !== id)
    
        await fs.promises.writeFile(this.fileName, JSON.stringify(arrayFiltrado))
    
       }catch(error){
        throw error
       }
   }

   async deleteProductInCarrito(idCarrito,idProducto){
    try{
     const contenido = await fs.promises.readFile(this.fileName)
     const contenidoParseado = JSON.parse(contenido)

    let carritoEncontrado = contenidoParseado.find(carrito => carrito.id == idCarrito)
    let carritoSinProd = await carritoEncontrado.productos.filter(prod => prod.id !== parseInt(idProducto));
    carritoEncontrado.productos = carritoSinProd;

    await fs.promises.writeFile(this.fileName, JSON.stringify(contenidoParseado))

    }catch(error){
     throw error
    }
  }
  async saveProductInCart(idCarrito,idProducto){
    try{
        await existeArchivo(this.fileName)

        const contenidoCrudo = await fs.promises.readFile(this.fileName)
        const contenido = JSON.parse(contenidoCrudo)

        //ME TRAIGO EL CARRITO SELECCIONADO POR SU ID 
        const carritoEncontrado =  contenido.find(carrito => carrito.id == idCarrito)
        const misproductos= carritoEncontrado.productos

        //MI ARRAY DE PRODUCTOS
        const leerProductos = JSON.parse(fs.readFileSync("productos.txt"))
        let objetoId = leerProductos.find((x) => x.id == idProducto);
        misproductos.push(objetoId)

        await fs.promises.writeFile(this.fileName, JSON.stringify(contenido));

    }catch(error){
        console.log("Error", error)
        return [];
    }
}

    // deleteAll(): void - Elimina todos los objetos presentes en el archivo.
   async deleteAll(){
       await creandoArchivo(this.fileName)
   }
}

module.exports= Carrito

