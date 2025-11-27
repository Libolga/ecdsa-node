import { useState } from "react";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import * as secp from "ethereum-cryptography/secp256k1";

const server = "http://localhost:3042";

function Transfer({ setBalance, address, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  async function transfer(evt) {
    evt.preventDefault();

    try {
      // Создаем сообщение для подписи (отправитель + получатель + сумма)
      const message = `${address} sends ${sendAmount} to ${recipient}`;
      const messageBytes = utf8ToBytes(message);
      const messageHash = keccak256(messageBytes);

      // Создаем цифровую подпись
      const signature = await secp.secp256k1.sign(messageHash, privateKey);

      const transaction = {
        sender: address,
        recipient: recipient,
        amount: parseInt(sendAmount),
        signature: Array.from(signature.toCompactRawBytes()),
        messageHash: Array.from(messageHash)
      };

      const response = await fetch(`${server}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      });

      const data = await response.json();

      if (response.ok) {
        setBalance(data.balance);
        alert("Transaction successful!");
        setSendAmount("");
        setRecipient("");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Transfer error:", error);
      alert("Transaction failed!");
    }
  }

  return (
    <div className="container transfer">
      <h1>Send Transaction</h1>

      <form onSubmit={transfer}>
        <label>
          Send Amount
          <input
            placeholder="1, 2, 3..."
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
          />
        </label>

        <label>
          Recipient
          <input
            placeholder="Recipient address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </label>

        <input type="submit" className="button" value="Transfer" />
      </form>
    </div>
  );
}

export default Transfer;
