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
  - C Error Handling
  - Error Management in C
  - errno in C
description: "Error handling patterns and techniques in C using errno, return codes, and assertions."
cssclasses:
  - code
---

# Error Handling

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

[[04-RESOURCES/Code/C/_README|C]] does not have exceptions like modern languages. Instead, errors are handled through **return codes**, the global **errno** variable, and **assertions**. Understanding these patterns is essential for writing robust C programs.

## Code

### Using errno

```c
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>

int main(void) {
    errno = 0;  // reset before operation
    
    FILE *file = fopen("nonexistent_file.txt", "r");
    
    if (file == NULL) {
        // perror prints error message with prefix
        perror("fopen");
        
        // strerror converts errno to string
        fprintf(stderr, "Error code %d: %s\n", errno, strerror(errno));
        
        return EXIT_FAILURE;
    }
    
    fclose(file);
    return EXIT_SUCCESS;
}
```

### Common errno Values

```c
#include <stdio.h>
#include <errno.h>
#include <string.h>

void demonstrate_errors(void) {
    // ENOENT - No such file or directory
    errno = ENOENT;
    printf("ENOENT (%d): %s\n", ENOENT, strerror(ENOENT));
    
    // EACCES - Permission denied
    errno = EACCES;
    printf("EACCES (%d): %s\n", EACCES, strerror(EACCES));
    
    // ENOMEM - Out of memory
    errno = ENOMEM;
    printf("ENOMEM (%d): %s\n", ENOMEM, strerror(ENOMEM));
    
    // EINVAL - Invalid argument
    errno = EINVAL;
    printf("EINVAL (%d): %s\n", EINVAL, strerror(EINVAL));
    
    // ERANGE - Result out of range
    errno = ERANGE;
    printf("ERANGE (%d): %s\n", ERANGE, strerror(ERANGE));
}

int main(void) {
    demonstrate_errors();
    return 0;
}
```

### Return Code Pattern

```c
#include <stdio.h>
#include <stdlib.h>

// error codes
typedef enum {
    ERR_SUCCESS = 0,
    ERR_NULL_POINTER = -1,
    ERR_OUT_OF_RANGE = -2,
    ERR_ALLOCATION_FAILED = -3,
    ERR_FILE_NOT_FOUND = -4
} ErrorCode;

// error message lookup
const char *error_message(ErrorCode code) {
    switch (code) {
        case ERR_SUCCESS: return "Success";
        case ERR_NULL_POINTER: return "Null pointer";
        case ERR_OUT_OF_RANGE: return "Value out of range";
        case ERR_ALLOCATION_FAILED: return "Memory allocation failed";
        case ERR_FILE_NOT_FOUND: return "File not found";
        default: return "Unknown error";
    }
}

// function that can fail
ErrorCode divide(int a, int b, int *result) {
    if (result == NULL) {
        return ERR_NULL_POINTER;
    }
    if (b == 0) {
        return ERR_OUT_OF_RANGE;
    }
    
    *result = a / b;
    return ERR_SUCCESS;
}

int main(void) {
    int result;
    ErrorCode err;
    
    err = divide(10, 2, &result);
    if (err == ERR_SUCCESS) {
        printf("10 / 2 = %d\n", result);
    }
    
    err = divide(10, 0, &result);
    if (err != ERR_SUCCESS) {
        fprintf(stderr, "Error: %s\n", error_message(err));
    }
    
    return EXIT_SUCCESS;
}
```

### Output Parameter Pattern

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

// returns success/failure, uses output parameter for value
bool safe_parse_int(const char *str, int *out_value) {
    if (str == NULL || out_value == NULL) {
        return false;
    }
    
    char *end;
    long val = strtol(str, &end, 10);
    
    // check for conversion errors
    if (end == str || *end != '\0') {
        return false;
    }
    
    // check for overflow
    if (val < INT_MIN || val > INT_MAX) {
        return false;
    }
    
    *out_value = (int)val;
    return true;
}

int main(void) {
    int value;
    
    if (safe_parse_int("42", &value)) {
        printf("Parsed: %d\n", value);
    }
    
    if (!safe_parse_int("not_a_number", &value)) {
        printf("Parse failed for 'not_a_number'\n");
    }
    
    if (!safe_parse_int("99999999999999", &value)) {
        printf("Parse failed for overflow\n");
    }
    
    return EXIT_SUCCESS;
}
```

### Assertions

```c
#include <stdio.h>
#include <assert.h>

// assertions are for programmer errors, not runtime errors
int factorial(int n) {
    // precondition: n must be non-negative
    assert(n >= 0 && "factorial requires non-negative input");
    
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

void process_buffer(const char *buffer, size_t size) {
    // assert preconditions
    assert(buffer != NULL && "buffer cannot be NULL");
    assert(size > 0 && "size must be positive");
    
    // process...
    printf("Processing %zu bytes\n", size);
}

int main(void) {
    printf("5! = %d\n", factorial(5));
    
    char data[] = "Hello";
    process_buffer(data, sizeof(data));
    
    // these would trigger assertions (in debug builds):
    // factorial(-1);
    // process_buffer(NULL, 10);
    
    return 0;
}
```

### Cleanup with goto

```c
#include <stdio.h>
#include <stdlib.h>

int process_file(const char *filename) {
    int result = -1;
    FILE *file = NULL;
    char *buffer = NULL;
    
    file = fopen(filename, "r");
    if (file == NULL) {
        perror("fopen");
        goto cleanup;
    }
    
    buffer = malloc(1024);
    if (buffer == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        goto cleanup;
    }
    
    // do work...
    if (fgets(buffer, 1024, file) == NULL) {
        if (ferror(file)) {
            fprintf(stderr, "Read error\n");
            goto cleanup;
        }
    }
    
    printf("Read: %s", buffer);
    result = 0;  // success
    
cleanup:
    if (buffer != NULL) free(buffer);
    if (file != NULL) fclose(file);
    return result;
}

int main(void) {
    if (process_file("test.txt") != 0) {
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}
```

### Error Logging

```c
#include <stdio.h>
#include <stdarg.h>
#include <time.h>

typedef enum {
    LOG_DEBUG,
    LOG_INFO,
    LOG_WARNING,
    LOG_ERROR
} LogLevel;

static LogLevel min_level = LOG_INFO;

void set_log_level(LogLevel level) {
    min_level = level;
}

void log_message(LogLevel level, const char *format, ...) {
    if (level < min_level) return;
    
    const char *level_names[] = {"DEBUG", "INFO", "WARNING", "ERROR"};
    
    time_t now = time(NULL);
    struct tm *tm_info = localtime(&now);
    char time_buf[26];
    strftime(time_buf, sizeof(time_buf), "%Y-%m-%d %H:%M:%S", tm_info);
    
    fprintf(stderr, "[%s] [%s] ", time_buf, level_names[level]);
    
    va_list args;
    va_start(args, format);
    vfprintf(stderr, format, args);
    va_end(args);
    
    fprintf(stderr, "\n");
}

int main(void) {
    set_log_level(LOG_DEBUG);
    
    log_message(LOG_DEBUG, "Starting application");
    log_message(LOG_INFO, "Processing %d items", 42);
    log_message(LOG_WARNING, "Resource usage at %d%%", 85);
    log_message(LOG_ERROR, "Failed to connect to %s", "database");
    
    return 0;
}
```

### setjmp/longjmp (Exception-like)

```c
#include <stdio.h>
#include <setjmp.h>

static jmp_buf jump_buffer;

typedef enum {
    NO_ERROR = 0,
    DIVIDE_BY_ZERO,
    OVERFLOW_ERROR
} ExceptionType;

int safe_divide(int a, int b) {
    if (b == 0) {
        longjmp(jump_buffer, DIVIDE_BY_ZERO);
    }
    return a / b;
}

int main(void) {
    int exception = setjmp(jump_buffer);
    
    if (exception == NO_ERROR) {
        // try block
        printf("10 / 2 = %d\n", safe_divide(10, 2));
        printf("10 / 0 = %d\n", safe_divide(10, 0));  // triggers longjmp
        printf("This won't print\n");
    } else {
        // catch block
        switch (exception) {
            case DIVIDE_BY_ZERO:
                fprintf(stderr, "Caught: Division by zero\n");
                break;
            default:
                fprintf(stderr, "Caught: Unknown exception\n");
        }
    }
    
    return 0;
}
```

## Details

### Error Handling Strategies

| Strategy | Use Case | Pros | Cons |
|----------|----------|------|------|
| Return codes | Most functions | Simple, explicit | Verbose, easy to ignore |
| errno | System/library calls | Standard convention | Global state, thread issues |
| Output parameter | Multiple return values | Clear success/failure | Extra parameter |
| Assertions | Debug invariants | Catches bugs early | Disabled in release |
| goto cleanup | Resource management | Single exit point | Can be misused |
| setjmp/longjmp | Complex unwinding | Exception-like | Hard to reason about |

### Best Practices

| Practice | Description |
|----------|-------------|
| Check all return values | Don't ignore function return codes |
| Reset errno before calls | errno may contain stale values |
| Use assertions for invariants | Not for runtime error handling |
| Document error conditions | Specify what errors a function can return |
| Fail fast | Detect and report errors early |
| Clean up resources | Always free/close on all exit paths |

***

## Appendix

*Note created on [[2025-12-31]] and last modified on [[2025-12-31]].*

### See Also

- [[C - File IO]]
- [[C - Memory Management]]
- [[04-RESOURCES/Code/C/_README|C Code Index]]
- [[MOC - Computer Science]]
- [[MOC - Development]]

### Backlinks

```dataview
LIST FROM [[C - Error Handling]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025
