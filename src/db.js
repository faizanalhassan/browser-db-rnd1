import {openDB} from 'idb';
import {measureTime} from "./utils";

const dbPromise = openDB('my-database', 2, {
    upgrade: measureTime((db, oldVersion) => {
        if (oldVersion < 1) {
            if (!db.objectStoreNames.contains('documents')) {
                db.createObjectStore('documents', {keyPath: 'id'});
            }
        }
        if (oldVersion < 2) {
            db.deleteObjectStore('documents');
            const store = db.createObjectStore('documents', {keyPath: 'id'});
            store.createIndex('scannables', 'scannables', {multiEntry: true});

        }

    }, "upgrade"),
});

export const addDocuments = measureTime(async (documents) => {
    const db = await dbPromise;
    const tx = db.transaction('documents', 'readwrite');
    const store = tx.objectStore('documents');
    documents.forEach((doc) => store.put(doc));
    await tx.done;
}, "addDocumentsIDB");


export const getAllDocuments = measureTime(async () => {
    const db = await dbPromise;
    const tx = db.transaction('documents', 'readonly');
    const store = tx.objectStore('documents');
    const allDocs = await store.getAll();
    await tx.done;
    return allDocs;
}, "getAllDocumentsIDB");


export const updateDocumentsWithScannables = measureTime(async () => {
    const db = await dbPromise;
    const tx = db.transaction('documents', 'readwrite');
    const store = tx.objectStore('documents');
    const allDocs = await store.getAll();
    const possibleValues = new Array(10).fill('prod').map((v, i) => `${v}-${i + 1}`);
    allDocs.forEach((doc) => {
        const scannables = [];
        const numberOfItems = Math.floor(Math.random() * possibleValues.length) + 1;
        while (scannables.length < numberOfItems) {
            const randomValue = possibleValues[Math.floor(Math.random() * possibleValues.length)];
            if (!scannables.includes(randomValue)) {
                scannables.push(randomValue);
            }
        }
        doc.scannables = scannables;
        store.put(doc);
    });
    await tx.done;
    console.log('All documents updated with scannables.');
}, "updateDocumentsWithScannablesIDB");

export const clearAllDocuments = measureTime(async () => {
  const db = await dbPromise;
  const tx = db.transaction('documents', 'readwrite');
  const store = tx.objectStore('documents');
  store.clear(); // Clear all documents
  await tx.done;
  console.log('All documents cleared.');
}, "clearAllDocumentsIDB");

