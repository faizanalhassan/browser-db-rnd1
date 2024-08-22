import React, {useEffect, useState, useRef} from 'react';
import {
    generateDocuments,
    addDocuments,
    clearAllDocuments,
    getAllDocuments,
    TOTAL_DOCS
} from './db';
import {measureTime} from "./utils";


const App = () => {
    const [documents, setDocuments] = useState([]);
    const isInitialized = useRef(false);
    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;
        const initializeData = measureTime(async () => {
            await clearAllDocuments(); // Clear existing documents
            const docs = generateDocuments(); // Generate documents with scannables
            await addDocuments(docs); // Add documents to IndexedDB
            console.log(`${TOTAL_DOCS} documents added to IndexedDB`);
            const fetchedDocs = await getAllDocuments();
            setDocuments(fetchedDocs);
        }, "initializeData");

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
