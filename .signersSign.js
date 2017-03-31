#!/usr/bin/env node

var program = require('commander'),
    bitcoin = require('bitcoinjs-lib'),
    fs      = require('fs');

program
  .version('0.0.1')
  .usage('[options]')
  .option('-c, --number-required <n>', 'number required', parseInt)
  .option('-k, --private-key [value]', 'private key')
  .option('-a, --additional-addresses  <values>', 'public keys', (val) => val.split(','))
  .parse(process.argv);

var privateKey = program.privateKey,
    pair = bitcoin
      .ECPair
      .fromWIF(privateKey);

if (!program.additionalAddresses.includes(pair.getAddress())) {
  program
    .additionalAddresses
    .unshift(pair.getAddress());
}
var clearText = `${program.numberRequired}:${program.additionalAddresses.join(',')}`,
    cipherText = pair
      .sign(
        bitcoin
          .crypto
          .sha256(clearText))
      .toDER()
      .toString('base64');

console.log(`signs_required: ${clearText}`);
console.log(`signed message: ${cipherText}`);

