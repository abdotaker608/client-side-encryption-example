import { generateKeyPair, encrypt } from "./crypto.js";
import { sendPrivateKeyToServer, sendEncryptedMessageToServer } from "./server.js";
import { createIndexedDB, savePublicKeyInIndexedDB } from "./indexedDB.js";

async function run() {
  const { privateKey, publicKey } = await generateKeyPair();

  await createIndexedDB();

  await savePublicKeyInIndexedDB(publicKey);

  await sendPrivateKeyToServer(privateKey);

  const encryptedMessage = await encrypt("Hello, World!");

  sendEncryptedMessageToServer(encryptedMessage);
}

run();
