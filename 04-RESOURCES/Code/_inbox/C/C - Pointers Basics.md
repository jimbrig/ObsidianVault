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
  - C Pointers
  - Pointers in C
  - C Pointer Basics
description: "Fundamental pointer concepts in C including declaration, dereferencing, and pointer arithmetic."
cssclasses:
  - code
---

# Pointers Basics

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

**Pointers** are one of the most powerful and distinctive features of [[04-RESOURCES/Code/C/_README|C]]. A pointer is a variable that stores the **memory address** of another variable, enabling direct memory manipulation, efficient data structures, and dynamic memory allocation.

## Code

### Pointer Declaration and Initialization

```c
#include <stdio.h>

int main(void) {
    int value = 42;
    int *ptr = &value;  // ptr holds the address of value
    
    printf("Value: %d\n", value);           // 42
    printf("Address of value: %p\n", (void*)&value);
    printf("Pointer ptr: %p\n", (void*)ptr);
    printf("Dereferenced ptr: %d\n", *ptr); // 42
    
    return 0;
}
```

### Pointer Operators

```c
#include <stdio.h>

int main(void) {
    int x = 10;
    int *p = &x;  // & = address-of operator
    
    // * = dereference operator (get value at address)
    *p = 20;      // modifies x through the pointer
    
    printf("x = %d\n", x);  // 20
    
    return 0;
}
```

### Pointer Arithmetic

```c
#include <stdio.h>

int main(void) {
    int arr[] = {10, 20, 30, 40, 50};
    int *p = arr;  // points to first element
    
    printf("*p     = %d\n", *p);       // 10
    printf("*(p+1) = %d\n", *(p + 1)); // 20
    printf("*(p+2) = %d\n", *(p + 2)); // 30
    
    p++;  // move to next element
    printf("After p++: *p = %d\n", *p); // 20
    
    // pointer difference
    int *start = arr;
    int *end = &arr[4];
    printf("Elements between: %td\n", end - start); // 4
    
    return 0;
}
```

### Pointers and Arrays

```c
#include <stdio.h>

void print_array(int *arr, int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);  // arr[i] is equivalent to *(arr + i)
    }
    printf("\n");
}

int main(void) {
    int numbers[] = {1, 2, 3, 4, 5};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    // array name decays to pointer to first element
    print_array(numbers, size);
    
    // equivalent pointer notation
    int *p = numbers;
    for (int i = 0; i < size; i++) {
        printf("%d ", *(p + i));
    }
    printf("\n");
    
    return 0;
}
```

### Pointer to Pointer

```c
#include <stdio.h>

int main(void) {
    int value = 100;
    int *p = &value;     // pointer to int
    int **pp = &p;       // pointer to pointer to int
    
    printf("value = %d\n", value);
    printf("*p = %d\n", *p);
    printf("**pp = %d\n", **pp);
    
    // modify through double pointer
    **pp = 200;
    printf("value after **pp = 200: %d\n", value);
    
    return 0;
}
```

### NULL Pointers

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *ptr = NULL;  // null pointer initialization
    
    // always check for NULL before dereferencing
    if (ptr != NULL) {
        printf("Value: %d\n", *ptr);
    } else {
        printf("Pointer is NULL\n");
    }
    
    // common pattern with dynamic allocation
    ptr = malloc(sizeof(int));
    if (ptr == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        return EXIT_FAILURE;
    }
    
    *ptr = 42;
    printf("Allocated value: %d\n", *ptr);
    
    free(ptr);
    ptr = NULL;  // good practice: set to NULL after freeing
    
    return EXIT_SUCCESS;
}
```

### Function Pointers

```c
#include <stdio.h>

// function pointer type definition
typedef int (*operation_fn)(int, int);

int add(int a, int b) { return a + b; }
int subtract(int a, int b) { return a - b; }
int multiply(int a, int b) { return a * b; }

int calculate(int a, int b, operation_fn op) {
    return op(a, b);
}

int main(void) {
    // direct function pointer usage
    int (*op)(int, int) = add;
    printf("add(5, 3) = %d\n", op(5, 3));
    
    // using typedef
    operation_fn operations[] = {add, subtract, multiply};
    char *names[] = {"add", "subtract", "multiply"};
    
    for (int i = 0; i < 3; i++) {
        printf("%s(10, 4) = %d\n", names[i], calculate(10, 4, operations[i]));
    }
    
    return 0;
}
```

## Details

### Pointer Types and Sizes

| Type | Description |
|------|-------------|
| `int *` | Pointer to int |
| `char *` | Pointer to char (often used for strings) |
| `void *` | Generic pointer (no type information) |
| `const int *` | Pointer to constant int (value cannot be changed) |
| `int * const` | Constant pointer to int (address cannot be changed) |
| `const int * const` | Constant pointer to constant int |

### Common Pitfalls

| Issue | Description |
|-------|-------------|
| Dangling pointer | Pointer to freed/deallocated memory |
| Wild pointer | Uninitialized pointer with garbage address |
| Memory leak | Losing reference to allocated memory |
| Buffer overflow | Writing beyond allocated memory |

### Void Pointers

```c
#include <stdio.h>

void print_value(void *ptr, char type) {
    switch (type) {
        case 'i': printf("%d\n", *(int*)ptr); break;
        case 'f': printf("%f\n", *(float*)ptr); break;
        case 'c': printf("%c\n", *(char*)ptr); break;
    }
}

int main(void) {
    int i = 42;
    float f = 3.14f;
    char c = 'A';
    
    print_value(&i, 'i');
    print_value(&f, 'f');
    print_value(&c, 'c');
    
    return 0;
}
```

***

## Appendix

*Note created on [[2025-12-31]] and last modified on [[2025-12-31]].*

### See Also

- [[C - Hello World and Program Structure]]
- [[C - Memory Management]]
- [[04-RESOURCES/Code/C/_README|C Code Index]]
- [[MOC - Computer Science]]
- [[MOC - Development]]

### Backlinks

```dataview
LIST FROM [[C - Pointers Basics]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025
