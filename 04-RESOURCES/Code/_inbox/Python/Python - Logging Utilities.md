---
creation_date: 2024-04-15
modification_date: 2024-12-31
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Code
  - Topic/Python
  - Status/Complete
aliases:
  - Logging Utilities
  - Python Logger Setup
description: Python logging utility functions with configurable settings
cssclasses:
  - code
---

# Logging Utilities

> [!info] Code Properties
> - **Language**: Python
> - **Modules**: `logging`, `pydantic`

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

Utility functions for setting up Python logging with configurable settings and consistent formatting.

## Code

### Logger Utility

```python
"""Logging Utilities"""
import logging
from typing import Optional

from settings import Settings


def get_logger(settings: Optional[Settings] = None) -> logging.Logger:
    """Get configured Logger instance.
    
    Args:
        settings: Optional Settings object with log_level
        
    Returns:
        Configured Logger instance
    """
    logger = logging.getLogger("<project>")
    logger.setLevel(settings.log_level if settings else "INFO")

    # clear existing handlers
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)

    handler = logging.StreamHandler()
    handler.setLevel(settings.log_level if settings else "INFO")
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    return logger
```

### Settings Configuration

```python
"""Settings Configuration"""
import typing
from functools import lru_cache
from pydantic_yaml import YamlModel


class Settings(YamlModel):
    api_key: typing.Optional[str] = None
    log_level: str = "INFO"


@lru_cache()
def get_settings_from_file(path: str = "config.yml") -> Settings:
    """Load settings from YAML file with caching."""
    settings = Settings.parse_file(path)
    return settings
```

## Usage

```python
from logging_utils import get_logger
from settings import get_settings_from_file

# get settings and logger
settings = get_settings_from_file("config.yml")
logger = get_logger(settings)

# use the logger
logger.info("Application started")
logger.warning("This is a warning")
logger.error("An error occurred")
```

***

## Appendix

*Note created on [[2024-04-15]] and last modified on [[2024-12-31]].*

### See Also

- [[04-RESOURCES/Code/Python/_README|Python Code Index]]

### Backlinks

```dataview
LIST FROM [[Python - Logging Utilities]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2024
