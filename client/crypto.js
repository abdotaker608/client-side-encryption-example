import { getPublicKeyFromIndexedDB } from "./indexedDB.js";

async function generateKeyPair() {
  // Generate private & public key pair
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP", // RSA-OAEP is the name of the algorithm used for assymetric encryption
      modulusLength: 4096, // The length of the modulus, the bigger this number is the more secure your key is but the more computational resources it uses
      publicExponent: new Uint8Array([1, 0, 1]), // Use this value unless you have a good reason to do otherwise
      hash: "SHA-256", // SHA-256 is the algorithm used for generating the hash/digest in the RSA-OAEP algorithm
    },
    true, // We pass `true` here to set the key as exportable
    ["encrypt", "decrypt"] // We will use the key pair for both encryption and decryption
  );

  // Exports the private key as a buffer in the `pkcs8` format which is the standard format for presenting private keys
  const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  // Exports the public key as a buffer in the `spki` format which is the standard format for presenting public keys
  const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);

  // return the key pair
  return { privateKey, publicKey };
}

async function encrypt(message) {
  // Get public `Crypto Key` instance from indexedDB
  const publicKey = await getPublicKeyFromIndexedDB();

  // Encode the message to be encrtyped
  const encoder = new TextEncoder();
  const encoded = encoder.encode(message);

  const encryptedMessage = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP", hash: "SHA-256" }, // Information about the algorithm used
    publicKey, // Our public `Crypto Key` instance
    encoded // Our encoded message that we want to encrypt
  );

  // return the encrypted message
  return encryptedMessage;
}

export { generateKeyPair, encrypt };
