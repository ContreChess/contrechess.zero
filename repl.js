/*jshint esversion: 6 */
const babel = require('babel-core'),
      vm    = require('vm'),
      repl  = require('repl');

let context = repl.start({ eval: evaluate}).context;

const models = require('src/server/models');

for (let name in models) {
  context[name] = models[name];
}

const RESULT_SYMBOL = '__eval_res';

function evaluate (cmd, context, filename, callback) {
  context = vm.createContext(context);

  if (cmd.match(/await/)) {
    let assign = null;
    if (cmd.match(/\=/)) {
      let parts = cmd.split('=');
      assign = parts[0];
      cmd = parts.slice(1).join('=');
    }

    cmd = '(async function() { return ' + cmd + '})()';

    try {
      cmd = compile(cmd);
    } catch (e) {
      callback(new repl.Recoverable());
      return;
    }

    let res;

    try {
      res = vm.runInContext(cmd, context);
    } catch (e) {
      callback(e);
      return;
    }

    res.then(r => {
    },
    (e) => callback(e));

    return;
  }
  
  simpleEval(cmd, context, filename, callback);
}

function simpleEval (cmd, context, filename, callback) {
  try {
    cmd = compile(cmd);
  } catch (e) {
    callback(new repl.Recoverable());
    return;
  }

  try {
    callback(null, vm.runInContext(cmd, context));
  } catch (e) {
    callback(e);
    return;
  }
}

function compile (cmd) {
  return babel.transform(cmd, {
    sourceType: 'script',
    blacklist: ['strict'],
  }).code;
}
