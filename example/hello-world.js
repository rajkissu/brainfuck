'use strict';

var brainfuck   = require('brainfuck'),
    source      = '>+++++++++[<++++++++>-]<.>+++++++[<++++>-]<+.+++++++..+++.[-]'
                + '>++++++++[<++++>-]<.>+++++++++++[<++++++++>-]<-.--------.+++'
                + '.------.--------.[-]>++++++++[<++++>-]<+.';

brainfuck.exec(source, function(err, output) {
    if (err) { throw err };

    console.log(output);
});
