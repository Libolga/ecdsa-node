const express = require("express");
const cors = require("cors");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const secp256k1 = require("ethereum-cryptography/secp256k1").secp256k1;

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

// Балансы по публичным ключам (замени на сгенерированные)
const balances = {
  "02b2c739c4e8cae1b6b6e58fc9d90b82e03f064c0b8b0e8a8a8a8a8a8a8a8a8a8a8": 100, // замени на реальный публичный ключ 1
  "03c4f8e8cae1b6b6e58fc9d90b82e03f064c0b8b0e8a8a8a8a8a8a8a8a8a8a8a8a8": 50,  // замени на реальный публичный ключ 2
  "04d5f8e8cae1b6b6e58fc9d90b82e03f064c0b8b0e8a8a8a8a8a8a8a8a8a8a8a8a8": 75,  // замени на реальный публичный ключ 3
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, messageHash } = req.body;
  
  // Верификация подписи
  const isSigned = secp256k1.verify(signature, messageHash, sender);
  
  if (!isSigned) {
    res.status(400).send({ message: "Invalid signature!" });
    return;
  }

  // Проверка баланса
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
