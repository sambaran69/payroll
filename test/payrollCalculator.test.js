var calculators = require('../lib/payrollCalculator');
var assert = require('chai').assert;
var expect = require('chai').expect;

describe('Payroll Calculator', function() {
    describe('Logic', function() {

        beforeEach(function(){
            calculator = new calculators.PayrollCalculator();

        });

        it('Can be initialized properly', function() {
            assert.isObject(calculator);
        });

        it('Throws error if invalid arguments are passed', function() {
            expect(calculator.CalculatePaySlip.bind(calculator,0,0)).to.throw(Error,'Invalid numerical values passed');
            expect(calculator.CalculatePaySlip.bind(calculator,{},{})).to.throw(Error,'Invalid numerical values passed');
            expect(calculator.CalculatePaySlip.bind(calculator,'abc','def')).to.throw(Error,'Invalid numerical values passed');
        });

        it('Should calculate income tax correctly', function() {
            var payslip = calculator.CalculatePaySlip(60050,9);

            expect(payslip).to.have.property('incomeTax');
            expect(payslip.incomeTax).to.deep.equal(922);
        });

        it('Should calculate gross income correctly', function() {
            var payslip = calculator.CalculatePaySlip(60050,9);

            expect(payslip).to.have.property('grossIncome');
            expect(payslip.grossIncome).to.deep.equal(5004);
        });

        it('Should calculate net income correctly', function() {
            var payslip = calculator.CalculatePaySlip(60050,9);

            expect(payslip).to.have.property('netIncome');
            expect(payslip.netIncome).to.deep.equal(4082);
        });

        it('Should calculate super correctly', function() {
            var payslip = calculator.CalculatePaySlip(60050,9);

            expect(payslip).to.have.property('super');
            expect(payslip.super).to.deep.equal(450);
        });


    });

});