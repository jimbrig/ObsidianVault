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
  - C Memory Management
  - Dynamic Memory in C
  - malloc and free
description: "Dynamic memory allocation in C using malloc, calloc, realloc, and free."
cssclasses:
  - code
---

# Memory Management

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

[[04-RESOURCES/Code/C/_README|C]] provides manual **memory management** through dynamic allocation functions in `<stdlib.h>`. Unlike languages with garbage collection, C requires explicit allocation and deallocation, giving developers fine-grained control over memory usage.

## Code

### malloc - Memory Allocation

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    // allocate memory for a single integer
    int *num = malloc(sizeof(int));
    if (num == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        return EXIT_FAILURE;
    }
    
    *num = 42;
    printf("Value: %d\n", *num);
    
    free(num);
    num = NULL;
    
    return EXIT_SUCCESS;
}
```

### Allocating Arrays

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5;
    
    // allocate array of n integers
    int *arr = malloc(n * sizeof(int));
    if (arr == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        return EXIT_FAILURE;
    }
    
    // initialize and use
    for (int i = 0; i < n; i++) {
        arr[i] = i * 10;
    }
    
    for (int i = 0; i < n; i++) {
        printf("arr[%d] = %d\n", i, arr[i]);
    }
    
    free(arr);
    arr = NULL;
    
    return EXIT_SUCCESS;
}
```

### calloc - Contiguous Allocation

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5;
    
    // calloc initializes all bytes to zero
    int *arr = calloc(n, sizeof(int));
    if (arr == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        return EXIT_FAILURE;
    }
    
    // all values are 0
    for (int i = 0; i < n; i++) {
        printf("arr[%d] = %d\n", i, arr[i]);
    }
    
    free(arr);
    return EXIT_SUCCESS;
}
```

### realloc - Resize Allocation

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int capacity = 2;
    int *arr = malloc(capacity * sizeof(int));
    if (arr == NULL) return EXIT_FAILURE;
    
    arr[0] = 10;
    arr[1] = 20;
    
    // expand array
    capacity = 5;
    int *temp = realloc(arr, capacity * sizeof(int));
    if (temp == NULL) {
        free(arr);  // original memory still valid
        return EXIT_FAILURE;
    }
    arr = temp;
    
    arr[2] = 30;
    arr[3] = 40;
    arr[4] = 50;
    
    for (int i = 0; i < capacity; i++) {
        printf("arr[%d] = %d\n", i, arr[i]);
    }
    
    free(arr);
    return EXIT_SUCCESS;
}
```

### Dynamic 2D Array

```c
#include <stdio.h>
#include <stdlib.h>

int **create_2d_array(int rows, int cols) {
    int **arr = malloc(rows * sizeof(int*));
    if (arr == NULL) return NULL;
    
    for (int i = 0; i < rows; i++) {
        arr[i] = malloc(cols * sizeof(int));
        if (arr[i] == NULL) {
            // cleanup on failure
            for (int j = 0; j < i; j++) {
                free(arr[j]);
            }
            free(arr);
            return NULL;
        }
    }
    return arr;
}

void free_2d_array(int **arr, int rows) {
    for (int i = 0; i < rows; i++) {
        free(arr[i]);
    }
    free(arr);
}

int main(void) {
    int rows = 3, cols = 4;
    
    int **matrix = create_2d_array(rows, cols);
    if (matrix == NULL) return EXIT_FAILURE;
    
    // initialize
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            matrix[i][j] = i * cols + j;
        }
    }
    
    // print
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            printf("%3d ", matrix[i][j]);
        }
        printf("\n");
    }
    
    free_2d_array(matrix, rows);
    return EXIT_SUCCESS;
}
```

### Dynamic String

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *duplicate_string(const char *src) {
    size_t len = strlen(src) + 1;  // +1 for null terminator
    char *dst = malloc(len);
    if (dst != NULL) {
        memcpy(dst, src, len);
    }
    return dst;
}

int main(void) {
    const char *original = "Hello, World!";
    
    char *copy = duplicate_string(original);
    if (copy == NULL) {
        fprintf(stderr, "Failed to duplicate string\n");
        return EXIT_FAILURE;
    }
    
    printf("Original: %s\n", original);
    printf("Copy: %s\n", copy);
    
    free(copy);
    return EXIT_SUCCESS;
}
```

## Details

### Memory Functions Reference

| Function | Signature | Description |
|----------|-----------|-------------|
| `malloc` | `void *malloc(size_t size)` | Allocate uninitialized memory |
| `calloc` | `void *calloc(size_t num, size_t size)` | Allocate zero-initialized memory |
| `realloc` | `void *realloc(void *ptr, size_t size)` | Resize existing allocation |
| `free` | `void free(void *ptr)` | Deallocate memory |

### Best Practices

| Practice | Description |
|----------|-------------|
| Always check for NULL | Allocation can fail if memory is exhausted |
| Free what you allocate | Every `malloc`/`calloc` needs a matching `free` |
| Set pointer to NULL after free | Prevents use-after-free bugs |
| Use `sizeof` with type | `malloc(n * sizeof(*ptr))` adapts to type changes |
| Handle realloc carefully | Use temp variable to avoid losing original pointer |

### Common Memory Bugs

| Bug | Description | Prevention |
|-----|-------------|------------|
| Memory leak | Allocated memory never freed | Track allocations, use tools like Valgrind |
| Double free | Calling `free()` twice on same pointer | Set to NULL after free |
| Use after free | Accessing memory after it's freed | Set to NULL after free |
| Buffer overflow | Writing beyond allocated bounds | Check bounds, use safe functions |
| Uninitialized read | Reading `malloc` memory before setting | Use `calloc` or initialize explicitly |

### Memory Debugging Tools

| Tool | Platform | Usage |
|------|----------|-------|
| Valgrind | Linux/macOS | `valgrind --leak-check=full ./program` |
| AddressSanitizer | GCC/Clang | Compile with `-fsanitize=address` |
| Dr. Memory | Windows/Linux | Similar to Valgrind |

***

## Appendix

*Note created on [[2025-12-31]] and last modified on [[2025-12-31]].*

### See Also

- [[C - Pointers Basics]]
- [[C - Data Types]]
- [[04-RESOURCES/Code/C/_README|C Code Index]]
- [[MOC - Computer Science]]
- [[MOC - Development]]

### Backlinks

```dataview
LIST FROM [[C - Memory Management]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025
