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
  - C Structs
  - C Unions
  - Structures in C
  - Custom Data Types in C
description: "Defining and using structs, unions, and custom data types in C."
cssclasses:
  - code
---

# Structs and Unions

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

[[04-RESOURCES/Code/C/_README|C]] allows creating custom **composite data types** using `struct` and `union`. Structures group related variables together, while unions allow storing different data types in the same memory location.

## Code

### Basic Struct

```c
#include <stdio.h>
#include <string.h>

struct Person {
    char name[50];
    int age;
    float height;
};

int main(void) {
    // declaration and initialization
    struct Person person1;
    strcpy(person1.name, "Alice");
    person1.age = 30;
    person1.height = 5.6f;
    
    // designated initializer (C99+)
    struct Person person2 = {
        .name = "Bob",
        .age = 25,
        .height = 5.9f
    };
    
    // positional initializer
    struct Person person3 = {"Charlie", 35, 6.0f};
    
    printf("%s is %d years old\n", person1.name, person1.age);
    printf("%s is %.1f feet tall\n", person2.name, person2.height);
    
    return 0;
}
```

### Typedef with Structs

```c
#include <stdio.h>

// typedef for cleaner usage
typedef struct {
    double x;
    double y;
} Point;

typedef struct {
    Point center;
    double radius;
} Circle;

double distance(Point a, Point b) {
    double dx = b.x - a.x;
    double dy = b.y - a.y;
    return sqrt(dx * dx + dy * dy);
}

int main(void) {
    Point p1 = {0.0, 0.0};
    Point p2 = {3.0, 4.0};
    
    Circle c = {
        .center = {5.0, 5.0},
        .radius = 2.5
    };
    
    printf("Point: (%.1f, %.1f)\n", p1.x, p1.y);
    printf("Circle center: (%.1f, %.1f), radius: %.1f\n", 
           c.center.x, c.center.y, c.radius);
    
    return 0;
}
```

### Pointers to Structs

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char title[100];
    char author[50];
    int year;
    double price;
} Book;

void print_book(const Book *book) {
    // arrow operator for pointer access
    printf("Title: %s\n", book->title);
    printf("Author: %s\n", book->author);
    printf("Year: %d\n", book->year);
    printf("Price: $%.2f\n", book->price);
}

int main(void) {
    // stack allocation
    Book book1 = {"The C Programming Language", "K&R", 1988, 59.99};
    print_book(&book1);
    
    printf("\n");
    
    // heap allocation
    Book *book2 = malloc(sizeof(Book));
    if (book2 == NULL) return EXIT_FAILURE;
    
    strcpy(book2->title, "Expert C Programming");
    strcpy(book2->author, "Peter van der Linden");
    book2->year = 1994;
    book2->price = 49.99;
    
    print_book(book2);
    
    free(book2);
    return EXIT_SUCCESS;
}
```

### Arrays of Structs

```c
#include <stdio.h>

typedef struct {
    int id;
    char name[30];
    double score;
} Student;

void print_students(const Student students[], int count) {
    printf("%-5s %-20s %s\n", "ID", "Name", "Score");
    printf("%-5s %-20s %s\n", "---", "----", "-----");
    
    for (int i = 0; i < count; i++) {
        printf("%-5d %-20s %.2f\n", 
               students[i].id, 
               students[i].name, 
               students[i].score);
    }
}

int main(void) {
    Student class[] = {
        {101, "Alice", 92.5},
        {102, "Bob", 88.0},
        {103, "Charlie", 95.5},
        {104, "Diana", 91.0}
    };
    
    int count = sizeof(class) / sizeof(class[0]);
    print_students(class, count);
    
    return 0;
}
```

### Nested Structs

```c
#include <stdio.h>

typedef struct {
    int day;
    int month;
    int year;
} Date;

typedef struct {
    char street[100];
    char city[50];
    char state[3];
    char zip[10];
} Address;

typedef struct {
    char name[50];
    Date birth_date;
    Address address;
} Employee;

int main(void) {
    Employee emp = {
        .name = "John Doe",
        .birth_date = {15, 6, 1990},
        .address = {
            .street = "123 Main St",
            .city = "Springfield",
            .state = "IL",
            .zip = "62701"
        }
    };
    
    printf("Name: %s\n", emp.name);
    printf("DOB: %02d/%02d/%d\n", 
           emp.birth_date.month, 
           emp.birth_date.day, 
           emp.birth_date.year);
    printf("Address: %s, %s, %s %s\n",
           emp.address.street,
           emp.address.city,
           emp.address.state,
           emp.address.zip);
    
    return 0;
}
```

### Unions

```c
#include <stdio.h>

// union shares memory among members
typedef union {
    int i;
    float f;
    char str[20];
} Data;

int main(void) {
    Data data;
    
    printf("Size of union: %zu bytes\n", sizeof(Data));
    
    // only one member valid at a time
    data.i = 42;
    printf("data.i = %d\n", data.i);
    
    data.f = 3.14f;
    printf("data.f = %f\n", data.f);
    // data.i is now garbage
    
    return 0;
}
```

### Tagged Union (Discriminated Union)

```c
#include <stdio.h>
#include <string.h>

typedef enum {
    TYPE_INT,
    TYPE_FLOAT,
    TYPE_STRING
} ValueType;

typedef struct {
    ValueType type;
    union {
        int int_val;
        float float_val;
        char string_val[50];
    } data;
} Value;

void print_value(const Value *v) {
    switch (v->type) {
        case TYPE_INT:
            printf("Integer: %d\n", v->data.int_val);
            break;
        case TYPE_FLOAT:
            printf("Float: %f\n", v->data.float_val);
            break;
        case TYPE_STRING:
            printf("String: %s\n", v->data.string_val);
            break;
    }
}

int main(void) {
    Value values[3];
    
    values[0].type = TYPE_INT;
    values[0].data.int_val = 42;
    
    values[1].type = TYPE_FLOAT;
    values[1].data.float_val = 3.14f;
    
    values[2].type = TYPE_STRING;
    strcpy(values[2].data.string_val, "Hello");
    
    for (int i = 0; i < 3; i++) {
        print_value(&values[i]);
    }
    
    return 0;
}
```

### Bit Fields

```c
#include <stdio.h>

typedef struct {
    unsigned int active : 1;    // 1 bit
    unsigned int ready : 1;     // 1 bit
    unsigned int error : 1;     // 1 bit
    unsigned int mode : 3;      // 3 bits (values 0-7)
    unsigned int priority : 4;  // 4 bits (values 0-15)
} Flags;

int main(void) {
    Flags status = {0};
    
    printf("Size of Flags: %zu bytes\n", sizeof(Flags));
    
    status.active = 1;
    status.ready = 1;
    status.mode = 5;
    status.priority = 10;
    
    printf("Active: %u\n", status.active);
    printf("Mode: %u\n", status.mode);
    printf("Priority: %u\n", status.priority);
    
    return 0;
}
```

## Details

### Struct vs Union Memory Layout

| Type | Memory | Usage |
|------|--------|-------|
| `struct` | Sum of all member sizes (plus padding) | Store multiple values simultaneously |
| `union` | Size of largest member | Store one value at a time, save memory |

### Struct Padding and Alignment

```c
#include <stdio.h>

// may have padding between members
struct Padded {
    char a;     // 1 byte + 3 padding
    int b;      // 4 bytes
    char c;     // 1 byte + 3 padding
};              // total: 12 bytes

// reordered for better packing
struct Packed {
    int b;      // 4 bytes
    char a;     // 1 byte
    char c;     // 1 byte + 2 padding
};              // total: 8 bytes

int main(void) {
    printf("Padded: %zu bytes\n", sizeof(struct Padded));
    printf("Packed: %zu bytes\n", sizeof(struct Packed));
    return 0;
}
```

***

## Appendix

*Note created on [[2025-12-31]] and last modified on [[2025-12-31]].*

### See Also

- [[C - Data Types]]
- [[C - Pointers Basics]]
- [[C - Memory Management]]
- [[04-RESOURCES/Code/C/_README|C Code Index]]
- [[MOC - Computer Science]]
- [[MOC - Development]]

### Backlinks

```dataview
LIST FROM [[C - Structs and Unions]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025
