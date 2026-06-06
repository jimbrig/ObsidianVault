---
creation_date: 2025-12-31
modification_date: 2025-12-31
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Code
  - Topic/Development
  - Topic/C
  - Status/Complete
aliases:
  - Basic Hello World C Program
  - C Program Structure
  - Hello World in C
description: "Foundational C program structure with Hello World example and compilation instructions."
cssclasses:
  - code
---

# Hello World and Program Structure

> [!info] Code Properties
> - **Language**: [[04-RESOURCES/Code/C/_README|C]]

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 1
maxLevel: 4
includeLinks: true
```

## Overview

Every [[04-RESOURCES/Code/C/_README|C]] program follows a fundamental structure consisting of **preprocessor directives**, **function declarations**, and a `main()` entry point. 

This note covers the essential building blocks of a [[04-RESOURCES/Code/C/_README|C]] program.

## Code

### Minimal Hello World

The simplest valid C program:

```c
#include <stdio.h>

int main(void) {
    printf("Hello, World!\n");
    return 0;
}
```

### Program Structure Breakdown

A complete C program with common structural elements:

```c
// preprocessor directives
#include <stdio.h>   // standard input/output
#include <stdlib.h>  // standard library (malloc, exit, etc.)
#include <string.h>  // string manipulation

// macro definitions
#define MAX_SIZE 100
#define VERSION "1.0.0"

// type definitions
typedef unsigned int uint;

// function prototypes (forward declarations)
void greet(const char *name);
int add(int a, int b);

// global variables (use sparingly)
static int counter = 0;

// main entry point
int main(int argc, char *argv[]) {
    // argc: argument count
    // argv: argument vector (array of strings)
    
    printf("Program: %s\n", argv[0]);
    printf("Version: %s\n", VERSION);
    
    greet("World");
    
    int result = add(5, 3);
    printf("5 + 3 = %d\n", result);
    
    return EXIT_SUCCESS;  // 0 indicates success
}

// function definitions
void greet(const char *name) {
    printf("Hello, %s!\n", name);
    counter++;
}

int add(int a, int b) {
    return a + b;
}
```

### Command Line Arguments

Handling command line arguments:

```c
#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("Number of arguments: %d\n", argc);
    
    for (int i = 0; i < argc; i++) {
        printf("argv[%d]: %s\n", i, argv[i]);
    }
    
    // alternative main signature (equivalent)
    // int main(int argc, char **argv)
    
    return 0;
}
```

## Details

### Compilation

Compile a C program using GCC:

```bash
# basic compilation
gcc hello.c -o hello

# with warnings and debugging symbols
gcc -Wall -Wextra -g hello.c -o hello

# optimized release build
gcc -O2 -Wall hello.c -o hello
```

Using Clang:

```bash
clang hello.c -o hello
```

On Windows with MSVC:

```cmd
cl hello.c
```

### Return Values

| Return Value | Meaning |
|--------------|---------|
| `0` or `EXIT_SUCCESS` | Program completed successfully |
| `1` or `EXIT_FAILURE` | Program encountered an error |
| Other non-zero | Application-specific error codes |

### Common Preprocessor Directives

| Directive | Purpose |
|-----------|---------|
| `#include <file>` | Include system header |
| `#include "file"` | Include local header |
| `#define NAME value` | Define a macro constant |
| `#ifdef` / `#ifndef` | Conditional compilation |
| `#pragma once` | Include guard (non-standard but widely supported) |

### Header Guards

Standard pattern to prevent multiple inclusion:

```c
// myheader.h
#ifndef MYHEADER_H
#define MYHEADER_H

// declarations here

#endif // MYHEADER_H
```

***

## Appendix

*Note created on [[2025-12-31]] and last modified on [[2025-12-31]].*

### See Also

- [[04-RESOURCES/Code/C/_README|C Code Index]]
- [[MOC - Computer Science]]
- [[MOC - Development]]

### Backlinks

```dataview
LIST FROM [[C - Hello World and Program Structure]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025
