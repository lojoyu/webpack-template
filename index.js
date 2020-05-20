#! /usr/bin/env node

//Load Modules
//require = require('esm')(module /*, options*/);
//require('../src/cli').cli(process.argv);
var clihandler = require("./core/cliHandler");

//Initialize CLI Handler
cliHandler.listen();