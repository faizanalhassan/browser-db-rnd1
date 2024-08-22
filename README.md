# IndexedDB React Application

This is a minimal React application that demonstrates how to use IndexedDB to store and manage large amounts of data. The application creates a database with 20,000 documents, each containing 50 properties. The documents are later updated with a `scannables` array containing randomly selected values.

## Features

- Initializes an IndexedDB with an object store named `documents`.
- Generates 20,000 documents with 50 properties each.
- Updates documents with a `scannables` array containing random values.
- Adds an index on the `scannables` property to allow optimized querying.

## Technologies Used

- React
- IndexedDB (via the `idb` library)
- JavaScript (ES6+)
