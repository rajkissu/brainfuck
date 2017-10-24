# What is this example?

I tried to create a minimal "ASCII-Art to Brainfuck code" converter. While the conversion is fine, the brainfuck lib
quickly runs out of memory.

This demo reads the `.txt` files and turns them into BF source that logs the same ASCII-Art again. The resulting source
is dumped into a `.bf` file with the same name. After that, the brainfuck lib is called to run it directly in node.

While this works like a charm for the small *ascii-art.txt*, the bigger *hacktoberfest.txt* gets converted successfully
(try it with a native brainfuck interpreter!) but the js lib spits out call stack size errors.
