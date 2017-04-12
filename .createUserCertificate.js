#!/usr/bin/env node

var program = require('commander'),
    bitcoin = require('bitcoinjs-lib'),
    fs      = require('fs');

program
  .version('0.0.1')
  .usage('[options]')
  .option('-a, --btc-address [value]', 'btc address')
  .option('-u, --user-name [value]', 'user name')
  .option('-t, --auth-type [value]', 'authentication type')
  .option('-k, --private-key [value]', 'private key')
  .option('-f, --file [path]', 'export cert to specified file')
  .parse(process.argv);

var textToSign  = program.btcAddress + '#' + (program.authType || 'web') + '/' + program.userName,
    privateKey  = program.privateKey,
    pair        = bitcoin.ECPair.fromWIF(privateKey),
    hash        = bitcoin.crypto.sha256(textToSign),
    signature   = pair.sign(hash),
    cert        = signature.toDER().toString('base64');

if (program.file) {
  fs.writeSync(fs.openSync(program.file, 'r+'), cert);
}
console.log(`cert: ${cert}`);
console.log(`cert length: ${cert.length}`);

