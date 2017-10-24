const readline = require('readline');
const fs = require('fs');
const brainfuck = require('../../lib/brainfuck');

function doTheThing (name, cb) {
    let source = '';
    let currentIndex = 2;

    // prepare ASCII value for ' ' at index 0
    for (let i = 0; i < ' '.charCodeAt(0); i++) {
        source += '+';
    }

    source += '\n>\n';

    // prepare ASCII value for '#' at index 1
    for (let i = 0; i < '#'.charCodeAt(0); i++) {
        source += '+';
    }

    source += '\n>\n';

    // prepare ASCII value for '\n' at index 2
    for (let i = 0; i < '\n'.charCodeAt(0); i++) {
        source += '+';
    }

    // read file line by line
    const lineReader = readline.createInterface({input: fs.createReadStream(name + '.txt')});

    // for each line: append BF equivalent code
    lineReader.on('line', addLine);

    // when no more lines are coming: finalize and run
    lineReader.on('close', () => {
        console.log('created brainfuck source:\n', source);
        writeBfFile(name, source);
        brainfuck.exec(source, (err, output) => {
            if (err) { throw err; }
            console.log('brainfuck output:\n', output);
        });

        cb();
    });

    function addLine (line) {
        source += '\n';
        line.split('')
            .map(char => {
                switch (char) {
                    case ' ':
                    case '#':
                    case '\n':
                        return char;
                    default:
                        return '#';
                }
            })
            .forEach(addChar);
        addChar('\n');
    }

    function addChar (char) {
        goToIndex(getIndexForChar(char));
        source += '.';
    }

    function goToIndex (i) {
        let diff = i - currentIndex;

        if (diff < 0) {
            while (diff) {
                source += '<';
                ++diff;
            }
        } else if (diff > 0) {
            while (diff) {
                source += '>';
                --diff;
            }
        }
        // else : not needed :)

        currentIndex = i;
    }

    function getIndexForChar (char) {
        switch (char) {
            case ' ':
                return 0;
            case '#':
                return 1;
            case '\n':
                return 2;
        }
    }

    function writeBfFile (name, source) {
        fs.writeFileSync(name + '.bf', source);
    }
}

// the small one works
doTheThing('ascii-art', () => {
    // this one won't
    doTheThing('hacktoberfest');
});
