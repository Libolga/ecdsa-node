import { useState } from "react";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

const server = "http://localhost:3042";

function Wallet({ balance, setBalance, address, setAddress, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKeyValue = evt.target.value;
    setPrivateKey(privateKeyValue);
    
    try {
      // Генерируем публичный ключ из приватного
      const publicKey = secp.secp256k1.getPublicKey(privateKeyValue);
      const addressHex = toHex(publicKey);
      setAddress(addressHex);

      if (addressHex) {
        const response = await fetch(`${server}/balance/${addressHex}`);
        const data = await response.json();
        setBalance(data.balance);
      } else {
        setBalance(0);
      }
    } catch (error) {
      console.error("Error:", error);
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input 
          placeholder="Enter your private key" 
          value={privateKey} 
          onChange={onChange}
        />
      </label>

      <div>Address: {address.slice(0, 10)}...{address.slice(-8)}</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
