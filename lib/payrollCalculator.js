'use strict';
var _ = require('lodash');

function isValidNumber(numericalValue) {
    return (numericalValue && !isNaN(parseFloat(numericalValue)) && Math.round(parseFloat(numericalValue)) > 0);
}

function PayrollCalculator() {
    this.paySlip = {};
}

PayrollCalculator.prototype.CalculatePaySlip = function(annualSalary, superRate) {
    if (!isValidNumber(annualSalary) || !isValidNumber(superRate))
        throw new Error('Invalid numerical values passed');

    var incomeTax   = Math.round(this.CalculateTax(annualSalary) / 12);
    var grossIncome = Math.round(annualSalary / 12);

    this.paySlip = {
        grossIncome : grossIncome,
        incomeTax   : incomeTax,
        netIncome   : grossIncome - incomeTax,
        super       : Math.round(grossIncome * (superRate / 100))
    };
    return this.paySlip;
};

PayrollCalculator.prototype.CalculateTax = function(amount) {
    var tax = 0;

    if(amount > 180000){
        tax = (amount - 180000) * .45 + 54547;
    }
    else if( amount > 80000){
        tax = (amount - 80000) * .37 + 17547;
    }
    else if(amount > 37000){
        tax = (amount - 37000) * .325 + 3572;
    }
    else if(amount > 18200) {
        tax = (amount - 18200) * .19;
    }

    return tax;

    /*
     0 - $18,200             Nil
     $18,201 - $37,000       19c for each $1 over $18,200
     $37,001 - $80,000       $3,572 plus 32.5c for each $1 over $37,000
     $80,001 - $180,000      $17,547 plus 37c for each $1 over $80,000
     $180,001 and over       $54,547 plus 45c for each $1 over $180,000
     */
};

module.exports.PayrollCalculator = PayrollCalculator;