---
creation_date: 2026-06-07
modification_date: 2026-06-07
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: R - Base class() vs .class2()
tags:
  - Type/Code
  - Status/Complete
  - Topic/R
  - Topic/Development
aliases:
  - R - Base class() vs .class2()
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

Starting with R v4.0.0, a new base R function was added: `.class2()`. 

> [!TIP]
> *`Note that for objects x of an implicit (or an S4) class, when a (S3) generic function foo(x) is called, method dispatch may use more classes than are returned by class(x), e.g., for a numeric matrix, the foo.numeric() method may apply. The exact full character vector of the classes which UseMethod() uses, is available as .class2(x) since R version 4.0.0. (This also applies to S4 objects when S3 dispatch is considered, see below.)`*

> [!TIP]
> *`Beware that using .class2() for other reasons than didactical, diagnostical or for debugging may rather be a misuse than smart.`*

`sloop::s3_class()` and `.class2()` serve the same purpose, i.e. always returning the class vector that is used for dispatch; which is important especially where a class attribute has not been set. 


## Code

```R
class(pi)
[1] "numeric"

.class2(pi)
[1] "double" "numeric"

class(matrix(1:6, 2, 3))
[1] "matrix" "array"

.class2(matrix(1:6, 2, 3))
[1] "matrix"  "array"   "integer" "numeric"
```

***

## Appendix

*Note created on [[2026-06-07]] and last modified on [[2026-06-07]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026