import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import {measureTime} from "./utils";
let db;
const documentSchema = {
        title: 'document schema',
        version: 0,
        description: 'Schema for documents with scannables',
        primaryKey: 'id',
        type: 'object',
        properties: {
            id: {type: 'number'},
            scannables: {
                type: 'array',
                items: {type: 'string'}
            },
            // Add other 50 properties dynamically here
        },
        required: ['id', 'scannables'],
    };
async function setupDB() {
    db = await createRxDatabase({
        name: 'rxdb-dexie',
        storage: getRxStorageDexie()
    });



}
setupDB().then(() => console.log('RxDB-Dexie Database setup done'));


export const addDocuments = measureTime(async (documents) => {
    await db.documents.bulkInsert(documents);
}, "addDocuments");

export const getAllDocuments = measureTime(async () => {
    return db.documents.find().exec();
}, "getAllDocuments");

export const clearAllDocuments = measureTime(async () => {
    await db.documents?.remove();
    await db.addCollections({
        documents: {
            schema: documentSchema,
        },
    });
}, "clearAllDocuments");
