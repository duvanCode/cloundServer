require('dotenv').config();
const { MongoClient, ObjectID } = require('mongodb');

const uri = process.env.MONGO_SERVER;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let conn;

async function connectDB() {
    try {
        conn = await client.connect();
        console.log('Conexión exitosa a la base de datos');
        return conn.db(process.env.MONGO_DB);
    } catch (e) {
        console.error('Error al conectar a la base de datos:', e);
        throw e;
    }
}

async function closeDB() {
    try {
        await client.close();
        console.log('Conexión cerrada');
    } catch (e) {
        console.error('Error al cerrar la conexión a la base de datos:', e);
        throw e;
    }
}

async function insertDocument(document,colectionName) {
    try {
        const db = await connectDB();
        const collection = db.collection(colectionName);
        const result = await collection.insertOne(document);
        return result.insertedId;
    } finally {
        await closeDB();
    }
}

async function getDocuments(query = {},colectionName) {
    try {
        const db = await connectDB();
        const collection = db.collection(colectionName);
        return await collection.find(query).toArray();
    } finally {
        await closeDB();
    }
}

function esIdMongoValido(id) {
    const regex = /^[0-9a-fA-F]{24}$/;
    return regex.test(id);
}

async function getDocumentById(id,colectionName) {
    try {
        const db = await connectDB();
        const collection = db.collection(colectionName);
        if(!esIdMongoValido(id)) return false;
        return await collection.findOne({ _id: ObjectID(id) });
    } finally {
        await closeDB();
    }
}

async function updateDocument(id, updatedFields,colectionName) {
    try {
        const db = await connectDB();
        const collection = db.collection(colectionName);
        return await collection.updateOne({ _id: ObjectID(id) }, { $set: updatedFields });
    } finally {
        await closeDB();
    }
}

async function deleteDocument(id,colectionName) {
    try {
        const db = await connectDB();
        const collection = db.collection(colectionName);
        return await collection.deleteOne({ _id: ObjectID(id) });
    } finally {
        await closeDB();
    }
}

module.exports = {
    insertDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument
};
