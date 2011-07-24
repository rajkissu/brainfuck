'use strict';

var brainfuck   = require('../index'),
    source      = '>+++++++++[<++++++++>-]<.>+++++++[<++++>-]<+.+++++++..+++.[-]'
                + '>++++++++[<++++>-]<.>+++++++++++[<++++++++>-]<-.--------.+++'
                + '.------.--------.[-]>++++++++[<++++>-]<+.';

brainfuck.exec(source, function(err, output) {
    if (err) { throw err };

    console.log(output);
});
