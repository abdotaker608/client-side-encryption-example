/* 
  The MIME type `application/octet-stream` basically means that the payload is
  an arbitrary/unstructured binary data and it shouldn't be parsed in any way
*/

async function sendPrivateKeyToServer(privateKey) {
  // Send key to the server
  await fetch("http://localhost:8000/private-key", {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: privateKey,
  });
}

async function sendEncryptedMessageToServer(encryptedMessage) {
  // Send encrypted message to server
  await fetch("http://localhost:8000/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: encryptedMessage,
  });
}

export { sendPrivateKeyToServer, sendEncryptedMessageToServer };
