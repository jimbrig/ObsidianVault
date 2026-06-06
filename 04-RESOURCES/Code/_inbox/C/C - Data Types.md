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
  - C Data Types
  - Data Types in C
  - C Variables
description: "Comprehensive reference for C data types including primitives, arrays, and strings."
cssclasses:
  - code
---

# Data Types

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

[[04-RESOURCES/Code/C/_README|C]] provides a variety of **data types** for storing different kinds of values. Understanding type sizes, ranges, and proper usage is fundamental to writing correct and efficient C programs.

## Code

### Primitive Types

```c
#include <stdio.h>
#include <limits.h>
#include <float.h>
#include <stdbool.h>

int main(void) {
    // integer types
    char c = 'A';
    short s = 32767;
    int i = 2147483647;
    long l = 2147483647L;
    long long ll = 9223372036854775807LL;
    
    // unsigned variants
    unsigned char uc = 255;
    unsigned int ui = 4294967295U;
    
    // floating point
    float f = 3.14159f;
    double d = 3.141592653589793;
    long double ld = 3.14159265358979323846L;
    
    // boolean (C99+)
    bool flag = true;
    
    printf("char: %c (%d)\n", c, c);
    printf("int: %d\n", i);
    printf("float: %f\n", f);
    printf("double: %.15f\n", d);
    printf("bool: %s\n", flag ? "true" : "false");
    
    return 0;
}
```

### Type Sizes

```c
#include <stdio.h>
#include <stdint.h>

int main(void) {
    printf("char:        %zu bytes\n", sizeof(char));
    printf("short:       %zu bytes\n", sizeof(short));
    printf("int:         %zu bytes\n", sizeof(int));
    printf("long:        %zu bytes\n", sizeof(long));
    printf("long long:   %zu bytes\n", sizeof(long long));
    printf("float:       %zu bytes\n", sizeof(float));
    printf("double:      %zu bytes\n", sizeof(double));
    printf("long double: %zu bytes\n", sizeof(long double));
    printf("pointer:     %zu bytes\n", sizeof(void*));
    
    return 0;
}
```

### Fixed-Width Integer Types

```c
#include <stdio.h>
#include <stdint.h>
#include <inttypes.h>

int main(void) {
    // exact width types (guaranteed size)
    int8_t   i8  = -128;
    int16_t  i16 = -32768;
    int32_t  i32 = -2147483648;
    int64_t  i64 = -9223372036854775807LL - 1;
    
    uint8_t  u8  = 255;
    uint16_t u16 = 65535;
    uint32_t u32 = 4294967295U;
    uint64_t u64 = 18446744073709551615ULL;
    
    // use PRI macros for portable printing
    printf("int32_t: %" PRId32 "\n", i32);
    printf("uint64_t: %" PRIu64 "\n", u64);
    
    // size types
    size_t size = sizeof(int);
    ptrdiff_t diff = 10;
    
    printf("size_t: %zu\n", size);
    printf("ptrdiff_t: %td\n", diff);
    
    return 0;
}
```

### Arrays

```c
#include <stdio.h>

int main(void) {
    // static arrays
    int numbers[5] = {1, 2, 3, 4, 5};
    int zeros[10] = {0};  // all elements initialized to 0
    int partial[5] = {1, 2};  // remaining elements are 0
    
    // array size from initializer
    int auto_sized[] = {10, 20, 30};
    int size = sizeof(auto_sized) / sizeof(auto_sized[0]);
    
    printf("Array size: %d\n", size);
    
    // multidimensional arrays
    int matrix[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };
    
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            printf("%3d ", matrix[i][j]);
        }
        printf("\n");
    }
    
    return 0;
}
```

### Strings (Character Arrays)

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    // string literal (read-only, null-terminated)
    const char *str1 = "Hello";
    
    // character array (modifiable)
    char str2[] = "World";
    char str3[20] = "Buffer";
    
    // manual initialization
    char str4[6] = {'H', 'e', 'l', 'l', 'o', '\0'};
    
    printf("str1: %s (length: %zu)\n", str1, strlen(str1));
    printf("str2: %s\n", str2);
    
    // string operations
    char buffer[50];
    strcpy(buffer, str1);
    strcat(buffer, ", ");
    strcat(buffer, str2);
    strcat(buffer, "!");
    
    printf("Combined: %s\n", buffer);
    
    // safer alternatives (C11)
    char safe[20];
    strncpy(safe, "Hello, World!", sizeof(safe) - 1);
    safe[sizeof(safe) - 1] = '\0';
    
    return 0;
}
```

### Type Qualifiers

```c
#include <stdio.h>

int main(void) {
    // const - value cannot be modified
    const int MAX_SIZE = 100;
    
    // volatile - value may change unexpectedly (hardware, threads)
    volatile int sensor_value = 0;
    
    // const pointer vs pointer to const
    int x = 10, y = 20;
    
    const int *ptr1 = &x;     // pointer to const int
    // *ptr1 = 30;            // ERROR: cannot modify value
    ptr1 = &y;                // OK: can change pointer
    
    int *const ptr2 = &x;     // const pointer to int
    *ptr2 = 30;               // OK: can modify value
    // ptr2 = &y;             // ERROR: cannot change pointer
    
    const int *const ptr3 = &x;  // const pointer to const int
    
    printf("x = %d\n", x);
    
    return 0;
}
```

### Enumerations

```c
#include <stdio.h>

// basic enum
enum Color { RED, GREEN, BLUE };

// enum with explicit values
enum HttpStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_ERROR = 500
};

// typedef for cleaner usage
typedef enum {
    SUNDAY = 0,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY
} Weekday;

int main(void) {
    enum Color favorite = BLUE;
    enum HttpStatus status = OK;
    Weekday today = WEDNESDAY;
    
    printf("Color: %d\n", favorite);      // 2
    printf("Status: %d\n", status);       // 200
    printf("Day: %d\n", today);           // 3
    
    return 0;
}
```

## Details

### Primitive Type Ranges

| Type | Size (typical) | Range |
|------|----------------|-------|
| `char` | 1 byte | -128 to 127 or 0 to 255 |
| `unsigned char` | 1 byte | 0 to 255 |
| `short` | 2 bytes | -32,768 to 32,767 |
| `unsigned short` | 2 bytes | 0 to 65,535 |
| `int` | 4 bytes | -2,147,483,648 to 2,147,483,647 |
| `unsigned int` | 4 bytes | 0 to 4,294,967,295 |
| `long` | 4/8 bytes | Platform dependent |
| `long long` | 8 bytes | -9.2×10¹⁸ to 9.2×10¹⁸ |
| `float` | 4 bytes | ~6-7 decimal digits precision |
| `double` | 8 bytes | ~15-16 decimal digits precision |

### Format Specifiers

| Type | Specifier | Example |
|------|-----------|---------|
| `int` | `%d` or `%i` | `printf("%d", num);` |
| `unsigned int` | `%u` | `printf("%u", num);` |
| `long` | `%ld` | `printf("%ld", num);` |
| `long long` | `%lld` | `printf("%lld", num);` |
| `float` | `%f` | `printf("%f", num);` |
| `double` | `%lf` (scanf) / `%f` (printf) | `printf("%f", num);` |
| `char` | `%c` | `printf("%c", ch);` |
| `string` | `%s` | `printf("%s", str);` |
| `pointer` | `%p` | `printf("%p", ptr);` |
| `size_t` | `%zu` | `printf("%zu", size);` |
| `hex` | `%x` / `%X` | `printf("%x", num);` |
| `octal` | `%o` | `printf("%o", num);` |

***

## Appendix

*Note created on [[2025-12-31]] and last modified on [[2025-12-31]].*

### See Also

- [[C - Hello World and Program Structure]]
- [[C - Pointers Basics]]
- [[C - Structs and Unions]]
- [[04-RESOURCES/Code/C/_README|C Code Index]]
- [[MOC - Computer Science]]
- [[MOC - Development]]

### Backlinks

```dataview
LIST FROM [[C - Data Types]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025
