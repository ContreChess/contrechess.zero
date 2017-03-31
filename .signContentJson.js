#!/usr/bin/env node

var program = require('commander'),
    bitcoin = require('bitcoinjs-lib'),
    fs      = require('fs');

program
  .version('0.0.1')
  .usage('[options]')
  .option('-f, --file [path]', 'file to sign')
  .option('-k, --private-key [value]', 'private key')
  .parse(process.argv);

var userContentSettings = require('./' + program.file),
    privateKey = program.privateKey,
    signs = {},
    pair = bitcoin
      .ECPair
      .fromWIF(privateKey);

delete userContentSettings['signs'];

signs[pair.getAddress()] = pair
  .sign(
    bitcoin
      .crypto
      .sha256(JSON.stringify(userContentSettings)))
  .toDER()
  .toString('base64');

userContentSettings['signs'] = signs;

fs.writeSync(fs.openSync(program.file, 'r+'), JSON.stringify(userContentSettings, null, '  '));
