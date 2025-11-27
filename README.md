# ECDSA Node - Elliptic Curve Digital Signature Node

Проект демонстрирует использование цифровых подписей на эллиптических кривых для безопасных транзакций.

## Установка и запуск

### Сервер
```bash
cd server
npm install
node index.js
cd client  
npm install
npm run dev
cd private
node generate.cjs
