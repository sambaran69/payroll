'use strict';
var _           = require('lodash');
var util        = require('util');
var readline    = require('readline');
var calculators = require('./payrollCalculator');
var self, calculator, rl;

function isValidNumber(numericalValue) {
    return (numericalValue && !isNaN(parseFloat(numericalValue)) && Math.round(parseFloat(numericalValue)) > 0);
}

var Payroll = module.exports =function Payroll(invokePrompt, options) {
    // Initialize
    this.Init();

    if (invokePrompt) {
        options = options || {};
        this.input = options.input || process.stdin;
        this.output = options.output || process.stdout;

        rl = readline.createInterface({
            input: this.input,
            output: this.output
        });
        rl.setPrompt('myob-payroll> ');
        rl.prompt();

        rl.on('line', function (line) {
            try {
                self.Command(line.trim(), invokePrompt);
            } catch (e) {
                self.line(e);
            }
            rl.prompt();
        }).on('close', function() {
            console.log('Exiting Paroll.');
            process.exit(0);
        }.bind(this));
    }
}


Payroll.prototype.Init = function() {
    self = this;
    calculator = new calculators.PayrollCalculator();
}


Payroll.prototype.DisplayPayslip = function (paySlip, invokePrompt) {
    var output = util.format('%s,%s,%d,%d,%d,%d', paySlip.name, paySlip.payPeriod, paySlip.grossIncome, paySlip.incomeTax, paySlip.netIncome, paySlip.super);
    if (invokePrompt) {
        this.line();
        this.line(output);
    }
    return output;
};

Payroll.prototype.Command = function(command, invokePrompt) {
    var executed = false;
    var commandArray = command.split(',');

    if (!(commandArray.length === 5)) {
        if (invokePrompt)
            this.error(Error('Invalid Arguments'), 'There should be only 5 arguments with \',\' delimitter');
        return executed;
    }
    if (!(commandArray[0] && commandArray[1])) {
        if (invokePrompt)
            this.error(Error('Invalid Arguments'), 'Please provide First Name and Last Name');
        return executed;
    }
    if (!isValidNumber(commandArray[2])) {
        if (invokePrompt)
            this.error(Error('Invalid Arguments'), 'Please provide valid Annual Salary (eg. 60050)');
        return executed;
    }
    if (!isValidNumber(commandArray[3])) {
        if (invokePrompt)
            this.error(Error('Invalid Arguments'), 'Please provide valid Super Annuation Rate (eg. 9.5%)');
        return executed;
    }
    if (!commandArray[4] || commandArray[4].indexOf(' - ') < 0) {
        if (invokePrompt)
            this.error(Error('Invalid Arguments'), 'Please provide valid Pay Period (eg. 01 March - 31 March)');
        return executed;
    }

    try {
        var payslip         = calculator.CalculatePaySlip(parseFloat(commandArray[2]), parseFloat(commandArray[3]));
        payslip.name        = commandArray[0] + ' ' + commandArray[1];
        payslip.payPeriod   = commandArray[4];
        var response = self.DisplayPayslip(payslip, invokePrompt);
        return response;
    } catch (err) {
        this.error(Error('Invalid Arguments'), err.message);
        return executed;
    }
}

Payroll.prototype.error = function error(err, message) {
    this.line();
    this.sendError(err, message);
    this.line();

    rl.prompt();
};

Payroll.prototype.sendError = function error(err, message) {
    this.line('[!] ' + (message || 'ERROR') + ': ' + err.message.toUpperCase() + '');
};

Payroll.prototype.line = function line(line) {
    var data = (line || '') + '\n';
    this.output.write(data);
};


module.exports.Payroll = Payroll;