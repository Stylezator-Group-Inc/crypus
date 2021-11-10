/* 
    Crypus cryptocurrency v 0.0.4
    Author: Jahongir Sobirov
    License: MIT
    Crypus Ltd (c) 2021 All rights reserved
*/
const SHA256 = require("crypto-js/sha256");
class CryptoBlock {
  constructor(index, timestamp, data, precedingHash = " ") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.precedingHash = precedingHash;
    this.hash = this.computeHash();
    this.nonce = 0;
  }

  computeHash() {
    return SHA256(
      this.index +
        this.precedingHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  proofOfWork(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.computeHash();
    }
  }
}

class CryptoBlockchain {
  constructor() {
    this.blockchain = [this.startGenesisBlock()];
    this.difficulty = 4;
  }
  startGenesisBlock() {
    return new CryptoBlock(0, new Date(), "Crepto Ltd blockchain", "0");
  }

  obtainLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }
  addNewBlock(newBlock) {
    newBlock.precedingHash = this.obtainLatestBlock().hash;
    //newBlock.hash = newBlock.computeHash();
    newBlock.proofOfWork(this.difficulty);
    this.blockchain.push(newBlock);
  }

  checkChainValidity() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const precedingBlock = this.blockchain[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }
      if (currentBlock.precedingHash !== precedingBlock.hash) return false;
    }
    return true;
  }
}

let cryptoCoin = new CryptoBlockchain();

console.log("Crypus mining in progress....");
cryptoCoin.addNewBlock(
  new CryptoBlock(Math.random(), new Date(), {
    sender: "Computer",
    recipient: "User",
    quantity: 1
  })
);
console.log(JSON.stringify(cryptoCoin, null, 1));

var fs = require('fs');

fs.appendFile('mycoins.cry', JSON.stringify(cryptoCoin, null, 1), function (err) {
  if (err) throw err;
  console.log('Crypus coin is saved successfully in mycoins.cry.');
});
