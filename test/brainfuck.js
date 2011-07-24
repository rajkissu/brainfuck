'use strict';

var vows        = require('vows'),
    assert      = require('assert'),
    brainfuck   = require('../index.js');

/**
 * Brainfuck mock object
 */
var brainfuckMock = {
    prepare : function prepare(code) {
        return {
            brainfuck   : brainfuck,
            code        : code
        };
    },
    prepareVows : function prepareVows(code) {
        return {
            topic : this.prepare(code),
            'WHEN it is parsed' : { topic : parse }
        };
    }
};

/**
 * parse a Brainfuck string
 */
function parse(mock) {
    var brainfuck   = mock.brainfuck,
        code        = mock.code;

    brainfuck.exec(code, this.callback);
}

/**
 * assert current pointer state
 */
function assertPointer(expected) {
    return function testPointer(err, compiled) {
        assert.isNull(err); // no errors
        assert.strictEqual(this.pointer, expected); // actual pointer position equals expected
    };
}

/**
 * strict equal assert of current memory value expected value
 */
function assertValue(expected) {
    return function testValue(err, compiled) {
        assert.isNull(err); // no errors
        assert.strictEqual(this.data[this.pointer], expected); // actual value equals expected
    };
}

/**
 * strict equal assert of last output and expected value
 */
function assertOutput(expected) {
    return function testIO(err, compiled) {
        assert.isNull(err); // no errors
        assert.strictEqual(compiled, expected); // last actual ouput equals expected
    };
}

/**
 * strict equal assert of last input and expected value
 */
function assertInput(expected) {
    return function testIO(err, compiled) {
        assert.isNull(err); // no errors
        assert.strictEqual(this._input, expected); // last actual input equals expected
    };
}



/**
 * vows for pointer operations
 */
function pointerVows(code, expected) {
    var ret = brainfuckMock.prepareVows(code);

    ret['WHEN it is parsed']['THEN the pointer moves to position ' + expected] = assertPointer(expected);

    return ret;
}

/**
 * vows for memory value operations
 */
function valueVows(code, expected) {
    var ret = brainfuckMock.prepareVows(code);

    ret['WHEN it is parsed']['THEN the current value in memory changes to ' + expected] = assertValue(expected);

    return ret;
}

/**
 * vows for loop operations
 */
function loopVows(code, expected) {
    var ret = brainfuckMock.prepareVows(code);

    ret['WHEN it is parsed']['THEN the code in brackets is looped until the current value in memory is ' + expected] = assertValue(expected);

    return ret;
}

/**
 * vows for input operations
 */
function inputVows(code, expected) {
    var ret = brainfuckMock.prepareVows(code);

    ret['WHEN it is parsed']['THEN the value in STDIN equals ' + expected] = assertInput(expected);

    return ret;
}

/**
 * vows for output operations
 */
function outputVows(code, expected) {
    var ret = brainfuckMock.prepareVows(code);

    ret['WHEN it is parsed']['THEN the value in STDOUT equals ' + expected] = assertOutput(expected);

    return ret;
}

/**
 * setup the Brainfuck test suite
 */
vows.describe('Brainfuck')
    .addBatch({ 'GIVEN a string ">"' : pointerVows('>', 1) })
    .addBatch({ 'GIVEN a string ">><"' : pointerVows('>><', 1) })
    .addBatch({ 'GIVEN a string "+"' : valueVows('+', 1) })
    .addBatch({ 'GIVEN a string "++--"' : valueVows('++-', 1) })
    .addBatch({ 'GIVEN a string "[----]"' : valueVows('[----]', 0) })
    .addBatch({ 'GIVEN a string ">+++++++++[<++++++++>-]<"' : loopVows('>+++++++++[<++++++++>-]<', 72) })
    .addBatch({ 'GIVEN a string ">+++++++++[<++++++++>-]<."' : outputVows('>+++++++++[<++++++++>-]<.', 'H') })
    .addBatch({ 'GIVEN a string ","' : inputVows(',', 'H') })
    .export(module);
