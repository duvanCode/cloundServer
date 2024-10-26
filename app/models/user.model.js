require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

class DatabaseConnection {
    constructor() {
        this.uri = process.env.MONGO_SERVER;
        this.client = new MongoClient(this.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.dbName = process.env.MONGO_DB;
        this.connection = null;
    }

    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    async connect() {
        if (!this.connection) {
            try {
                const conn = await this.client.connect();
                this.connection = conn.db(this.dbName);
                console.log('Conexión exitosa a la base de datos');
            } catch (error) {
                console.error('Error al conectar a la base de datos:', error);
                throw error;
            }
        }
        return this.connection;
    }

    async close() {
        if (this.connection) {
            try {
                await this.client.close();
                this.connection = null;
                console.log('Conexión cerrada');
            } catch (error) {
                console.error('Error al cerrar la conexión:', error);
                throw error;
            }
        }
    }
}

// Funciones de operaciones con la base de datos
class DatabaseOperations {
    static async getCollection(collectionName) {
        const db = await DatabaseConnection.getInstance().connect();
        return db.collection(collectionName);
    }

    static esIdMongoValido(id) {
        const regex = /^[0-9a-fA-F]{24}$/;
        return regex.test(id);
    }

    static async insertDocument(document, collectionName) {
        const collection = await this.getCollection(collectionName);
        const result = await collection.insertOne(document);
        return result.insertedId;
    }

    static async getDocuments(query = {}, collectionName) {
        const collection = await this.getCollection(collectionName);
        return await collection.find(query).toArray();
    }

    static async getDocumentById(id, collectionName) {
        if (!this.esIdMongoValido(id)) return false;
        const collection = await this.getCollection(collectionName);
        return await collection.findOne({ _id: new ObjectId(id) });
    }

    static async updateDocument(id, updatedFields, collectionName) {
        const collection = await this.getCollection(collectionName);
        return await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedFields }
        );
    }

    static async deleteDocument(id, collectionName) {
        const collection = await this.getCollection(collectionName);
        return await collection.deleteOne({ _id: new ObjectId(id) });
    }
}

// Para cerrar la conexión cuando la aplicación se cierra
process.on('SIGINT', async () => {
    await DatabaseConnection.getInstance().close();
    process.exit(0);
});

module.exports = {
    insertDocument: DatabaseOperations.insertDocument.bind(DatabaseOperations),
    getDocuments: DatabaseOperations.getDocuments.bind(DatabaseOperations),
    getDocumentById: DatabaseOperations.getDocumentById.bind(DatabaseOperations),
    updateDocument: DatabaseOperations.updateDocument.bind(DatabaseOperations),
    deleteDocument: DatabaseOperations.deleteDocument.bind(DatabaseOperations)
};