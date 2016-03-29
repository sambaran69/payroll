var Calculator = require('../lib/payroll');
var assert = require('chai').assert;
var expect = require('chai').expect;

describe('Payroll Calculator', function() {
    beforeEach(function() {
        calculator = new Calculator();
        expectedResponse = [
            'David Rudd,01 March - 31 March,5004,922,4082,450',
            'Ryan Chen,01 March - 31 March,10000,2696,7304,1000'
        ];
    });

    it('Can Be Initialised Properly', function() {
        assert.isObject(calculator);
        assert.instanceOf(calculator, Calculator);
    });

    it('Empty Command Is Reported Invalid', function() {
        var response = calculator.Command('');
        assert.equal(response, false);
    });

    it('Invalid number of arguments passed Is Reported Invalid', function() {
        var response = calculator.Command('Calculate Payslip');
        assert.equal(response, false);
        var response = calculator.Command('Test,User,0');
        assert.equal(response, false);
        var response = calculator.Command('Test,User,10000,');
        assert.equal(response, false);
        var response = calculator.Command('Test,User,10000,9%,');
        assert.equal(response, false);
    });

    it('Command With No First or Last name is reported Invalid', function() {
        var response = calculator.Command(',,10000,10%,Start - End');
        assert.equal(response, false);
        var response = calculator.Command('Test,,10000,10%,Start - End');
        assert.equal(response, false);
        var response = calculator.Command(',User,10000,10%,Start - End');
        assert.equal(response, false);
    });

    it('Command with missing/incorrect Annual Salary is reported invalid', function() {
        var response = calculator.Command('Test,User,,10%,Start - End');
        assert.equal(response, false);
        var response = calculator.Command('Test,User,-10000,10%,Start - End');
        assert.equal(response, false);
        var response = calculator.Command('Test,User,Hello,10%,Start - End');
        assert.equal(response, false);
        var response = calculator.Command('Test,User,0,10%,Start - End');
        assert.equal(response, false);
        var response = calculator.Command('Test,User,0.4,10%,Start - End');
        assert.equal(response, false);
    });

    it('Command with missing/incorrect Super Rate is reported invalid', function() {
        var response = calculator.Command('Test,User,-10000,,Start - End');
        assert.equal(response, false);
        var response = calculator.Command('Test,User,10000,Hello,Start - End');
        assert.equal(response, false);
        var response = calculator.Command('Test,User,Hello,10,Start - End');
        assert.equal(response, false);
        var response = calculator.Command('Test,User,0,This is 10%,Start - End');
        assert.equal(response, false);
    });

    it('Command With missing/incorrect Pay Period is reported invalid', function() {
        var response = calculator.Command('Test,User,10000,10%,');
        assert.equal(response, false);
        var response = calculator.Command('Test,User,10000,Hello,01/01/2016');
        assert.equal(response, false);
        var response = calculator.Command('Test,User,Hello,10,01 Jan to 31 Jan');
        assert.equal(response, false);
    });

    it('Command with Correct arguments are executed correctly ', function() {
        var response = calculator.Command('David,Rudd,60050,9%,01 March - 31 March');
        expect(response).to.deep.equal(expectedResponse[0]);

        var response = calculator.Command('Ryan,Chen,120000,10%,01 March - 31 March');
        expect(response).to.deep.equal(expectedResponse[1]);
    });

});