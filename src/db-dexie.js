import Dexie from 'dexie';
import {measureTime} from "./utils";

const db = new Dexie('MyDatabase');
db.version(1).stores({
    documents: "++id, scannables",
})
export const addDocuments = measureTime(async (documents) => {
    await db.documents.bulkAdd(documents);
}, "addDocuments");


export const getAllDocuments = measureTime(async () => {
    return db.documents.toArray();
}, "getAllDocuments");


export const clearAllDocuments = measureTime(async () => {
    db.documents.clear();
}, "clearAllDocuments");


