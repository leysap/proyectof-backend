const admin = require("firebase-admin");
const serviceAccount = require("../backend-proyect.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://backend-proyect.firebaseio.com"
});

const db = admin.firestore() 
class ContenedorFirebase{
    
    constructor(collection){
        this.collection=db.collection(collection)
    }

    async save(objeto) {
        try {
            const idString= objeto.id.toString()
            let doc = this.collection.doc(idString);
            await doc.create(objeto);

        } catch (err) {
            throw new Error(console.log(err))
        };
    };
    
    async getAll() {
        try {
            let contentDB = (await this.collection.get()).docs;
            const datos=contentDB.map(resultado => resultado.data())
            return datos;

        } catch (err) {
            throw new Error(console.log(err))
        };
    };

    async deleteById(id) {
        try { 
            const doc= this.collection.doc(id)
            await doc.delete()
    
        } catch (err) {
            throw new Error(console.log(err))
        };
    };

    async getById(id) {
        try {
            const datos= await this.getAll()
            let objetoId = datos.find((x) => x.id == id);
            return objetoId
        
        } catch (err) {
            throw new Error(err)
        };
    };

    async updateProductInFirebase(objeto,id){
        const doc= this.collection.doc(id)
        await doc.update(objeto)
    }

}

module.exports= {ContenedorFirebase}