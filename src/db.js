import { openDB } from 'idb';

const dbPromise = openDB('my-database', 1, {
  upgrade(db) {
    // Create a new object store called 'documents' with 'id' as the key path
    if (!db.objectStoreNames.contains('documents')) {
      db.createObjectStore('documents', { keyPath: 'id' });
    }
  },
});

export const addDocuments = async (documents) => {
  const db = await dbPromise;
  const tx = db.transaction('documents', 'readwrite');
  const store = tx.objectStore('documents');
  documents.forEach((doc) => store.put(doc));
  await tx.done;
};


export const getAllDocuments = async () => {
  const db = await dbPromise;
  const tx = db.transaction('documents', 'readonly');
  const store = tx.objectStore('documents');
  const allDocs = await store.getAll();
  await tx.done;
  return allDocs;
};
