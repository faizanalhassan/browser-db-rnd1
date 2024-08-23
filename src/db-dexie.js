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

export const generateDocuments = measureTime((total_docs) => {
    const documents = [];
    const possibleValues = ['prod1', 'prod2', 'prod3', 'prod4', 'prod5', 'prod6', 'prod7', 'prod8', 'prod9', 'prod10'];

    for (let i = 0; i < total_docs; i++) {
        const doc = {id: i};
        for (let j = 0; j < 50; j++) {
            doc[`property${j + 1}`] = `Value ${j + 1}`;
        }

        // Generate a random array of scannables
        const scannables = [];
        const numberOfItems = Math.floor(Math.random() * 10) + 1;

        while (scannables.length < numberOfItems) {
            const randomValue = possibleValues[Math.floor(Math.random() * possibleValues.length)];
            if (!scannables.includes(randomValue)) {
                scannables.push(randomValue);
            }
        }

        doc.scannables = scannables; // Add scannables to the document
        documents.push(doc);
    }

    return documents;
}, "generateDocuments");
