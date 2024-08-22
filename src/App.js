import React, { useEffect, useState } from 'react';
import { addDocuments, getAllDocuments } from './db';

const generateDocuments = () => {
  const documents = [];
  for (let i = 0; i < 20000; i++) {
    const doc = { id: i };
    for (let j = 0; j < 50; j++) {
      doc[`property${j + 1}`] = `Value ${j + 1}`;
    }
    documents.push(doc);
  }
  return documents;
};

const App = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const initializeData = async () => {
      const existingDocs = await getAllDocuments();
      if (existingDocs.length === 0) {
        const docs = generateDocuments();
        await addDocuments(docs);
        console.log('20,000 documents added to IndexedDB');
      }
      const fetchedDocs = await getAllDocuments();
      setDocuments(fetchedDocs);
    };

    initializeData();
  }, []);

  return (
    <div>
      <h1>IndexedDB Example</h1>
      <p>Displaying the first 10 documents:</p>
      <ul>
        {documents.slice(0, 10).map((doc) => (
          <li key={doc.id}>
            {doc.id}: {Object.values(doc).slice(1, 6).join(', ')}...
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
