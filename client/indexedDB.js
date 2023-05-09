function createIndexedDB() {
  // Opens the indexedDB with name of `crypto` or creates a one if it doesn't exist
  const request = indexedDB.open("crypto");

  // Fires when the database is created or has a newer version
  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Create keys table if it doesn't exist
    if (!db.objectStoreNames.contains("keys")) db.createObjectStore("keys");
  };

  // returns a promise resolving after successfully opening the database
  return new Promise((res) => {
    request.onsuccess = res;
  });
}

async function savePublicKeyInIndexedDB(publicKey) {
  // Open the `crypto` database
  const request = indexedDB.open("crypto");

  // returns a promise resolving after saving the public key in the `keys` table
  return new Promise((res) => {
    request.onsuccess = (event) => {
      const db = event.target.result;

      // Starts a transaction with read & write permissions
      const transaction = db.transaction(["keys"], "readwrite");

      // This is a reference to the `keys` table
      const objectStore = transaction.objectStore("keys");

      // Save the given public key into our `keys` table
      objectStore.put(publicKey, "publicKey");

      res();
    };
  });
}

async function getPublicKeyFromIndexedDB() {
  // Opens the `crypto` database
  const request = indexedDB.open("crypto");

  // returns a promise resolving with the store public key buffer
  return new Promise((res) => {
    request.onsuccess = (event) => {
      const db = event.target.result;

      // Starts a transaction with the read permission
      const transaction = db.transaction(["keys"]);

      // This is a reference to the `keys` table
      const objectStore = transaction.objectStore("keys");

      // Retrieves the store public key buffer
      objectStore.get("publicKey").onsuccess = async (event) => {
        // Use the buffer to generate a `Crypto Key` instance
        const cryptoKey = await window.crypto.subtle.importKey(
          "spki", // The format the buffer is in, we used `spki` format while exporting the key
          event.target.result, // This is our public key buffer
          { name: "RSA-OAEP", hash: "SHA-256" }, // Information about the algorithm used while exporting the key
          false, // We pass `false` here since we are not going to export this `Crypto Key`
          ["encrypt"] // We will use this key for encryption only
        );

        res(cryptoKey); // Resolves with the public key buffer
      };
    };
  });
}

export { createIndexedDB, savePublicKeyInIndexedDB, getPublicKeyFromIndexedDB };
