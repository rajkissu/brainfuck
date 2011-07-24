/**
 * Brainfuck interpreter
 */
'use strict';

/**
 * top() method for getting the top of a stack
 */
if (!Array.prototype.top) {
    Array.prototype.top = function top() {
        return this[this.length - 1];
    };
}

/**
 * STDIN handler
 */
function _incoming(chunk) {
    var data    = this.data,
        pointer = this.pointer,
        cursor  = this.cursor;

    // get only the first character and add it to
    // the final output
    this._input += chunk = chunk.substring(0, 1);

    data[pointer] = chunk.charCodeAt(0);    // get the ASCII code

    // remove the listener and pause the stream
    process.stdin.removeListener('data', _incoming);
    process.stdin.pause();

    if (cursor < this.source.length) {
        _step(pointer, data, cursor);               // resume step
    } else if (this._callback) {
        this._callback(this._error, this.output);   // run callback
    }
}

/**
 * steps through code, parsing characters
 */
function _step(pointer, data, cursor) {
    var source  = this.source,
        current = data[pointer],
        _stack  = this._stack,
        _top, stdin, chr;

    // prepare the response
    switch(chr = source[cursor++]) {
        case '>' :  data[++pointer] = data[pointer] || 0;
                    break;

        case '<' :  if (pointer > 0) { --pointer; }
                    break;

        case '+' :  data[pointer] = ++current % 256;
                    break;

        case '-' :  data[pointer] = (current > 0) ? --current % 256 : current;
                    break;

        case '.' :  this.output += String.fromCharCode(data[pointer]);
                    break;

        case ',' :  this.cursor  = cursor;   // update cursor
                    stdin = process.stdin;
                    stdin.setEncoding('ascii');
                    stdin.on('data', _incoming);
                    stdin.resume();
                    return;

        case '[' :
            _top = _stack.top(); // get the top of the stack

            // no stack objects or it's pointing to another position
            if (!_top || _top.cursor !== (cursor - 1)) {
                _stack.push({
                    pointer : pointer,
                    cursor  : cursor - 1,
                    inLoop  : false,
                    next    : undefined
                });

                _top = _stack.top();
            }

            if (!current) { // non-zero, exit loop
                // in loop before, pop it
                _top = _top.inLoop ? _stack.pop() : _top;

                if (_top && _top.next) {
                    // jump to position
                    cursor = _top.next;
                } else {
                    // loop until it's cleared
                    while (']' !== source[cursor++]) {};
                }
            } else if (!_top.inLoop) {
                _top.inLoop = true;
            }

            break;

        case ']' :
            _top = _stack.top();

            if (!_top) {
                // bad syntax
                this._error = new Error('Syntax error, no preceeding "]"');
            } else {
                // location after closing of loop
                if (!_top.next) { _top.next  = cursor; }

                cursor  = _top.cursor; // first char after loop
            }

            break;

        default  :  this._error = new Error('Invalid operation: ' + chr);
    }

    this.cursor  = cursor;   // update cursor
    this.pointer = pointer; // update pointer

    if (cursor < source.length) {
        return _step(pointer, data, cursor);
    } else if (this._callback) {
        this._callback(this._error, this.output); // run callback
    }
}

/**
 * executes a Brainfuck string
 */
function exec(source, callback) {
    // set defaults
    this.data       = [ this.pointer = this.cursor = 0 ];
    this.output     = this._input = '';
    this.source     = source.replace(/[^+-\[\].,<>]+/g, '');
    this._callback  = ('function' === typeof callback) ? callback : undefined;
    this._stack     = [];

    _step(this.pointer, this.data, this.cursor); // begin stepping
}

/**
 * Brainfuck interpreter
 */
var brainfuck = module.exports = {
    _callback   : null,     // callback reference
    _stack      : [],       // function stack
    _input      : '',       // last entered input
    _error      : null,     // last known error
    data        : [ 0 ],    // data store
    source      : '',       // Brainfuck source code
    pointer     : 0,        // pointer to position in data store
    cursor      : 0,        // pointer to position in source
    exec        : exec,     // executes Brainfuck source
    output      : ''        // output so far
};

_step = _step.bind(brainfuck); // bind step to the Brainfuck singleton
_incoming = _incoming.bind(brainfuck); // bind step to the Brainfuck singleton
