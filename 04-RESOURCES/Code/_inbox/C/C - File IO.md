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
  - C File IO
  - File Handling in C
  - C File Operations
  - Reading and Writing Files in C
description: "File input/output operations in C using stdio functions."
cssclasses:
  - code
---

# File I/O

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

[[04-RESOURCES/Code/C/_README|C]] provides file I/O operations through the `<stdio.h>` library. Files are accessed via **file pointers** (`FILE *`) and can be read or written in text or binary mode.

## Code

### Opening and Closing Files

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    FILE *file = fopen("example.txt", "r");
    
    if (file == NULL) {
        perror("Error opening file");
        return EXIT_FAILURE;
    }
    
    // file operations here...
    
    if (fclose(file) != 0) {
        perror("Error closing file");
        return EXIT_FAILURE;
    }
    
    return EXIT_SUCCESS;
}
```

### Writing Text Files

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    FILE *file = fopen("output.txt", "w");
    if (file == NULL) {
        perror("Error creating file");
        return EXIT_FAILURE;
    }
    
    // write using fprintf
    fprintf(file, "Hello, World!\n");
    fprintf(file, "The answer is %d\n", 42);
    
    // write using fputs
    fputs("Another line\n", file);
    
    // write single character
    fputc('X', file);
    fputc('\n', file);
    
    fclose(file);
    printf("File written successfully\n");
    
    return EXIT_SUCCESS;
}
```

### Reading Text Files

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    FILE *file = fopen("input.txt", "r");
    if (file == NULL) {
        perror("Error opening file");
        return EXIT_FAILURE;
    }
    
    char buffer[256];
    
    // read line by line
    printf("Contents:\n");
    while (fgets(buffer, sizeof(buffer), file) != NULL) {
        printf("%s", buffer);
    }
    
    fclose(file);
    return EXIT_SUCCESS;
}
```

### Reading Character by Character

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    FILE *file = fopen("input.txt", "r");
    if (file == NULL) {
        perror("Error opening file");
        return EXIT_FAILURE;
    }
    
    int ch;
    int char_count = 0;
    int line_count = 0;
    
    while ((ch = fgetc(file)) != EOF) {
        char_count++;
        if (ch == '\n') {
            line_count++;
        }
    }
    
    printf("Characters: %d\n", char_count);
    printf("Lines: %d\n", line_count);
    
    fclose(file);
    return EXIT_SUCCESS;
}
```

### Formatted Reading with fscanf

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    FILE *file = fopen("data.txt", "r");
    if (file == NULL) {
        perror("Error opening file");
        return EXIT_FAILURE;
    }
    
    char name[50];
    int age;
    double score;
    
    // read formatted data
    while (fscanf(file, "%49s %d %lf", name, &age, &score) == 3) {
        printf("Name: %s, Age: %d, Score: %.2f\n", name, age, score);
    }
    
    fclose(file);
    return EXIT_SUCCESS;
}
```

### Binary File I/O

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id;
    char name[50];
    double value;
} Record;

int write_records(const char *filename, const Record *records, size_t count) {
    FILE *file = fopen(filename, "wb");
    if (file == NULL) return -1;
    
    size_t written = fwrite(records, sizeof(Record), count, file);
    fclose(file);
    
    return (written == count) ? 0 : -1;
}

int read_records(const char *filename, Record *records, size_t max_count, size_t *count) {
    FILE *file = fopen(filename, "rb");
    if (file == NULL) return -1;
    
    *count = fread(records, sizeof(Record), max_count, file);
    fclose(file);
    
    return 0;
}

int main(void) {
    Record data[] = {
        {1, "Alpha", 100.5},
        {2, "Beta", 200.75},
        {3, "Gamma", 300.25}
    };
    
    // write
    if (write_records("records.bin", data, 3) != 0) {
        fprintf(stderr, "Error writing records\n");
        return EXIT_FAILURE;
    }
    
    // read
    Record loaded[10];
    size_t count;
    if (read_records("records.bin", loaded, 10, &count) != 0) {
        fprintf(stderr, "Error reading records\n");
        return EXIT_FAILURE;
    }
    
    printf("Read %zu records:\n", count);
    for (size_t i = 0; i < count; i++) {
        printf("  ID: %d, Name: %s, Value: %.2f\n",
               loaded[i].id, loaded[i].name, loaded[i].value);
    }
    
    return EXIT_SUCCESS;
}
```

### File Positioning

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    FILE *file = fopen("example.txt", "r");
    if (file == NULL) {
        perror("Error opening file");
        return EXIT_FAILURE;
    }
    
    // get current position
    long pos = ftell(file);
    printf("Initial position: %ld\n", pos);
    
    // seek to end
    fseek(file, 0, SEEK_END);
    long file_size = ftell(file);
    printf("File size: %ld bytes\n", file_size);
    
    // seek back to beginning
    fseek(file, 0, SEEK_SET);
    // or: rewind(file);
    
    // seek relative to current position
    fseek(file, 10, SEEK_CUR);
    printf("Position after +10: %ld\n", ftell(file));
    
    fclose(file);
    return EXIT_SUCCESS;
}
```

### Appending to Files

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(void) {
    FILE *file = fopen("log.txt", "a");
    if (file == NULL) {
        perror("Error opening log file");
        return EXIT_FAILURE;
    }
    
    time_t now = time(NULL);
    fprintf(file, "[%s] Application started\n", ctime(&now));
    
    fclose(file);
    return EXIT_SUCCESS;
}
```

### Error Handling

```c
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>

int main(void) {
    FILE *file = fopen("nonexistent.txt", "r");
    
    if (file == NULL) {
        // method 1: perror
        perror("fopen failed");
        
        // method 2: strerror with errno
        fprintf(stderr, "Error: %s\n", strerror(errno));
        
        // method 3: check specific errors
        if (errno == ENOENT) {
            fprintf(stderr, "File does not exist\n");
        } else if (errno == EACCES) {
            fprintf(stderr, "Permission denied\n");
        }
        
        return EXIT_FAILURE;
    }
    
    // check for read/write errors
    char buffer[100];
    if (fgets(buffer, sizeof(buffer), file) == NULL) {
        if (feof(file)) {
            printf("End of file reached\n");
        } else if (ferror(file)) {
            fprintf(stderr, "Error reading file\n");
        }
    }
    
    fclose(file);
    return EXIT_SUCCESS;
}
```

## Details

### File Mode Strings

| Mode | Description |
|------|-------------|
| `"r"` | Read text (file must exist) |
| `"w"` | Write text (creates/truncates) |
| `"a"` | Append text (creates if needed) |
| `"r+"` | Read/write text (file must exist) |
| `"w+"` | Read/write text (creates/truncates) |
| `"a+"` | Read/append text |
| `"rb"` | Read binary |
| `"wb"` | Write binary |
| `"ab"` | Append binary |
| `"rb+"` / `"r+b"` | Read/write binary |
| `"wb+"` / `"w+b"` | Read/write binary (creates/truncates) |

### Seek Origins

| Constant | Description |
|----------|-------------|
| `SEEK_SET` | Beginning of file |
| `SEEK_CUR` | Current position |
| `SEEK_END` | End of file |

### Standard Streams

| Stream | Description | Default |
|--------|-------------|---------|
| `stdin` | Standard input | Keyboard |
| `stdout` | Standard output | Terminal |
| `stderr` | Standard error | Terminal |

***

## Appendix

*Note created on [[2025-12-31]] and last modified on [[2025-12-31]].*

### See Also

- [[C - Hello World and Program Structure]]
- [[C - Error Handling]]
- [[C - Structs and Unions]]
- [[04-RESOURCES/Code/C/_README|C Code Index]]
- [[MOC - Computer Science]]
- [[MOC - Development]]

### Backlinks

```dataview
LIST FROM [[C - File IO]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025

creation_date: 2025-12-31
modification_date: 2025-12-31
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Code
  - Status/WIP
aliases:
  - C - File IO
publish: true
permalink:
description:
cssclasses:
  - code
---

# C - File IO

> [!info] Code Properties
> - **Language**: 
> - **Packages**: 

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE] Sources:
> - *Source URL or reference*

Description of this code snippet/script/module.

## Code

```
# code goes here
```

## Usage

How to use this code:

```
# usage example
```

## Notes

Additional notes about the code.

***

## Appendix

*Note created on [[2025-12-31]] and last modified on [[2025-12-31]].*

### See Also

- [[04-RESOURCES/Code/_README|Code Index]]

### Backlinks

```dataview
LIST FROM [[C - File IO]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025
