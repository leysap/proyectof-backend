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
  
class ContenedorFile{

    constructor(fileName){
        this.fileName= fileName
    }

    //save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
   async save(objeto){
        try{
            const contenido =await this.getAll()
            contenido.push(objeto)
            await fs.promises.writeFile(this.fileName, JSON.stringify(contenido));
            return objeto
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

   //   //ACTUALIZA UN PRODUCTO 
  async updateProductById(idProducto,objeto){
    try{
     const data =await this.getAll()

    let idUno =parseInt(idProducto-1); 
    const idProd = parseInt(idProducto);

    const objetoEncontrado = data.find((x) => x.id == idProd)
    
    data[idUno].nombre = objeto.nombre
    data[idUno].timestamp = Date.now()
    data[idUno].descripcion = objeto.descripcion
    data[idUno].codigo = objeto.codigo
    data[idUno].stock = objeto.stock
    data[idUno].precio= objeto.precio
    data[idUno].foto = objeto.foto

    await fs.promises.writeFile("productos.txt", JSON.stringify(data))

    return objetoEncontrado
 
    }catch(error){
     throw error
    }
  }
}

module.exports= {ContenedorFile}