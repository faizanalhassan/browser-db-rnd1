import React, {/*useEffect,*/ useState, /*useRef*/} from 'react';
import * as pureDB from './db';
import * as dexieDB from './db-dexie';
import * as rxdbDexie from './db-rxdb-dexie';
import {measureTime/*, TOTAL_DOCS*/, generateDocuments} from "./utils";


const App = () => {
    const [selectedDB, setSelectedDB] = useState();
    const [totalDocs, setTotalDocs] = useState(10_000);
    const [documents, setDocuments] = useState([]);
    // const isInitialized = useRef(false);
    const handleDBChange = (e) => {
        setSelectedDB(e.target.value);
    }
    const handleTotalDocsChange = (e) => {
        setTotalDocs(e.target.value);
    }
    const startFlow = () => {
        /*if (isInitialized.current) return;
        isInitialized.current = true;*/
        console.log("===============STARTING FLOW==================")
        if(!selectedDB){
            console.log("No database is selected. Returning...");
            return
        }
        let dbFunctions;
        if (selectedDB === 'rxdb-dexie') {
            dbFunctions = rxdbDexie;
            console.log("Selected rxdbDexie")
        } else if (selectedDB === 'dexie') {
            dbFunctions = dexieDB;
            console.log("Selected Dexie.")
        } else {
            dbFunctions = pureDB;
            console.log("Selected Pure Index db.")
        }
        const initializeData = measureTime(async () => {
            await dbFunctions.clearAllDocuments(); // Clear existing documents
            const docs = generateDocuments(totalDocs); // Generate documents with scannables
            await dbFunctions.addDocuments(docs); // Add documents to IndexedDB
            console.log(`${totalDocs} documents added to IndexedDB`);
            const fetchedDocs = await dbFunctions.getAllDocuments();
            setDocuments(fetchedDocs);
        }, "initializeData");

        initializeData().then(
            () => console.log("===============FLOW END==================")
        );
    };

    return (
        <div>
            <h1>Select Database and Start</h1>
            <div>
                <label>
                    Total Documents
                </label>
                <input
                    type="number"
                    value={totalDocs}
                    onChange={handleTotalDocsChange}
                />
                <br/>
                <label>
                    <input
                        type="radio"
                        value="indexeddb"
                        checked={selectedDB === 'indexeddb'}
                        onChange={handleDBChange}
                    />
                    Pure IndexedDB
                </label>
                <label>
                    <input
                        type="radio"
                        value="dexie"
                        checked={selectedDB === 'dexie'}
                        onChange={handleDBChange}
                    />
                    Dexie
                </label>
                <label>
                    <input
                        type="radio"
                        value="rxdb-dexie"
                        checked={selectedDB === 'rxdb-dexie'}
                        onChange={handleDBChange}
                    />
                    rxdb (dexie)
                </label>
            </div>
            <button onClick={startFlow}>Start</button>

            <h2>Displaying the first 10 documents:</h2>
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
