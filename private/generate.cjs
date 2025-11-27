const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

function generateKeys() {
  const privateKey = secp.secp256k1.utils.randomPrivateKey();
  const publicKey = secp.secp256k1.getPublicKey(privateKey);
  
  console.log("private key:", toHex(privateKey));
  console.log("public key: ", toHex(publicKey));
  console.log("---");
}

// Генерируем 3 пары ключей
console.log("Generating 3 key pairs...");
generateKeys();
generateKeys();
generateKeys();
