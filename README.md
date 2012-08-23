[![build status](https://secure.travis-ci.org/rajkissu/brainfuck.png)](http://travis-ci.org/rajkissu/brainfuck)
# Brainfuck

A Brainfuck interpreter that runs on node.js!

## Installation

### Via npm (node package manager)
    npm install brainfuck

## Purpose

This was written with the intent of learning the concepts behind Turin-complete programming languages - as well as for some coding fun over the weekend! It was developed using vows (an asynchronous BDD/TDD framework).

## Learning Brainfuck

Designed by Urban Müller in 1993, Brainfuck is a Turing-complete programming language made of eight instructions, each a single character in length, and no operands:

    > : increments the data pointer
    < : decrements the data pointer
    + : increases byte-value at the data pointer by one
    - : decreases byte-value at the data pointer by one
    . : converts the byte-value at the data pointer into an ASCII character
    , : accepts input an stores it's byte-value at the data pointer
    [ : if the byte-value at the data pointer is zero, jump forward to the instruction after the matching ']'
    ] : if the byte-value at the data pointer is non-zero, jump back to the instruction after the matching '['
