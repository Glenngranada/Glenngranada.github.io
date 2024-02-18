;var GlennIndexDB = (function() {

    var indexDbCalls = {
        openIndexedDB: function(){
            return new Promise((resolve, reject) => {
                const request = window.indexedDB.open('glenn-app-store-db', 1);
        
                request.onerror = function(event) {
                    reject(new Error('Database open error: ' + event.target.error));
                };
        
                request.onsuccess = function(event) {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('products')) {
                        // If not, create the object store
                        const objectStore = db.createObjectStore('products', { keyPath: 'id' });
                        objectStore.createIndex('name', 'name', { unique: false }); // Example: Create an index on the 'name' property
                        objectStore.createIndex('price', 'price', { unique: false })
                        objectStore.createIndex('thumbnail', 'thumbnail', { unique: false })
                        // objectStore.createIndex('id', 'id', { unique: true })
                        objectStore.createIndex('category', 'category', { unique: false })
                        
                    }
                    resolve(db);
                };
        
                request.onupgradeneeded = function(event) {
                    console.log('xxxxxxxxxxxxxxxxxxx');
                    const db = event.target.result;
                    // Ensure that the 'products' object store is created during the upgrade process
                    if(!db.objectStoreNames.contains('products')){
                        db.createObjectStore('products');
                    }
                };
        
                // If the database is already created and the 'upgradeneeded' event is not triggered,
                // ensure that the 'products' object store exists
                request.onversionchange = function(event) {
                    console.log('eeeeeeeeeeeeeeeeeee');
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('products')) {
                        console.log('create ObjectStoreeeeeeeeeeeeeeeeeeeeeeeeee')
                        db.createObjectStore('products', { keyPath: 'id' });
                    }
                };
            });
        },
        addProduct: function(db, product){
            return new Promise((resolve, reject) => {

                // Check if the 'products' object store exists
                
                const transaction = db.transaction(['products'], 'readwrite');
                const objectStore = transaction.objectStore('products');

                // Check if the key already exists in the object store
                const request = objectStore.get(product.id);

                request.onsuccess = function(event) {
                    const existingProduct = event.target.result;
                    if (existingProduct) {
                        // If the key exists, update the existing record
                        const updateRequest = objectStore.put(product, product.id);

                        updateRequest.onerror = function(event) {
                            reject(new Error('Update product error: ' + event.target.error));
                        };

                        updateRequest.onsuccess = function(event) {
                            resolve();
                        };
                    } else {
                        // Proceed with adding the product
                        const addRequest = objectStore.add(product, product.id);

                        addRequest.onerror = function(event) {
                            reject(new Error('Add product error: ' + event.target.error));
                        };

                        addRequest.onsuccess = function(event) {
                            resolve();
                        };
                    }
                };

                request.onerror = function(event) {
                    reject(new Error('Check key error: ' + event.target.error));
                };
            });
        },
        getProducts: function(db){
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['products'], 'readonly');
                const objectStore = transaction.objectStore('products');
                const request = objectStore.getAll();
        
                request.onerror = function(event) {
                    reject(new Error('Get products error: ' + event.target.error));
                };
        
                request.onsuccess = function(event) {
                    resolve(event.target.result);
                };
            });
        },
        updateProduct: function(db, product){
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['products'], 'readwrite');
                const objectStore = transaction.objectStore('products');
                const request = objectStore.put(product);
        
                request.onerror = function(event) {
                    reject(new Error('Update product error: ' + event.target.error));
                };
        
                request.onsuccess = function(event) {
                    resolve();
                };
            });
        },
        deleteProduct: function(db, product){
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['products'], 'readwrite');
                const objectStore = transaction.objectStore('products');
                const request = objectStore.delete(productId);
        
                request.onerror = function(event) {
                    reject(new Error('Delete product error: ' + event.target.error));
                };
        
                request.onsuccess = function(event) {
                    resolve();
                };
            });
        }   
    }

    return indexDbCalls;

})();

// export function openIndexedDB() {
//     return new Promise((resolve, reject) => {
//         const request = window.indexedDB.open('glenn-app-store-db', 1);

//         request.onerror = function(event) {
//             reject(new Error('Database open error: ' + event.target.error));
//         };

//         request.onsuccess = function(event) {
//             const db = event.target.result;
//             resolve(db);
//         };

//         request.onupgradeneeded = function(event) {
//             const db = event.target.result;
//             if (!db.objectStoreNames.contains('products')) {
//                 db.createObjectStore('products', { keyPath: 'id' });
//             }
//         };
//     });
// }

// export function addProduct(db, product) {
//     return new Promise((resolve, reject) => {
//         const transaction = db.transaction(['products'], 'readwrite');
//         const objectStore = transaction.objectStore('products');
//         const request = objectStore.add(product, product.id);

//         request.onerror = function(event) {
//             reject(new Error('Add product error: ' + event.target.error));
//         };

//         request.onsuccess = function(event) {
//             resolve();
//         };
//     });
// }

// export function getProducts(db) {
//     return new Promise((resolve, reject) => {
//         const transaction = db.transaction(['products'], 'readonly');
//         const objectStore = transaction.objectStore('products');
//         const request = objectStore.getAll();

//         request.onerror = function(event) {
//             reject(new Error('Get products error: ' + event.target.error));
//         };

//         request.onsuccess = function(event) {
//             resolve(event.target.result);
//         };
//     });
// }

// export function updateProduct(db, product) {
//     return new Promise((resolve, reject) => {
//         const transaction = db.transaction(['products'], 'readwrite');
//         const objectStore = transaction.objectStore('products');
//         const request = objectStore.put(product);

//         request.onerror = function(event) {
//             reject(new Error('Update product error: ' + event.target.error));
//         };

//         request.onsuccess = function(event) {
//             resolve();
//         };
//     });
// }

// export function deleteProduct(db, productId) {
//     return new Promise((resolve, reject) => {
//         const transaction = db.transaction(['products'], 'readwrite');
//         const objectStore = transaction.objectStore('products');
//         const request = objectStore.delete(productId);

//         request.onerror = function(event) {
//             reject(new Error('Delete product error: ' + event.target.error));
//         };

//         request.onsuccess = function(event) {
//             resolve();
//         };
//     });
// }