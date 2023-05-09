const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Database = require("./db");
const crypto = globalThis.crypto;

const db = new Database();

const app = express();

// Use `CORS` middleware to bypass CORS issue
app.use(cors());

/* 
  The MIME type `application/octet-stream` basically means that the payload is
  an arbitrary/unstructured binary data and it shouldn't be parsed in any way
*/

// Endpoint for storing a private key sent in the body of the request in the database
app.post("/private-key", bodyParser.raw({ type: "application/octet-stream" }), async (req, res) => {
  // The request body is the private key buffer
  const buffer = req.body;

  // We transform the buffer into a base64 string to store it in the database
  const privateKey = buffer.toString("base64");

  // Save our private key string in the database
  db.set("privateKey", privateKey);

  res.status(200).end();
});

// Endpoint for decrypting a message encrypted with the public key corresponding
// to the private key we have stored in our database
app.post("/message", bodyParser.raw({ type: "application/octet-stream" }), async (req, res) => {
  // The request body is the encrypted message
  const encrypted = req.body;

  // We retrieve our stored private key string from the database
  const privateKey = db.get("privateKey");

  // We turn it back into it's original buffer form
  const buffer = Buffer.from(privateKey, "base64");

  // We use the private key buffer to generate a `Crypto key` instance
  const cryptoKey = await crypto.subtle.importKey("pkcs8", buffer, { name: "RSA-OAEP", hash: "SHA-256" }, false, [
    "decrypt",
  ]);

  try {
    // We use our `Crypto key` to decrypt the message and retrieve the encoded message
    const encoded = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, cryptoKey, encrypted);

    // We decode the encoded message to get the raw message
    const decoder = new TextDecoder();
    const message = decoder.decode(encoded);

    console.log(message); // Prints the raw message!

    res.status(200).end();
  } catch (err) {
    // Request payload is invalid
    res.status(400).end();
  }
});

app.listen(8000);
