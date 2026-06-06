---
creation_date: 2025-12-20
modification_date: 2025-12-20
author: No Clocks, LLC
tags:
  - Type/Code
  - Topic/R
  - Status/WIP
aliases:
  - Async Plumber API R Code
publish: true
permalink:
description:
cssclasses:
  - code
---

# Async Plumber API in R

```table-of-contents
title: ## Contents 
style: nestedList # TOC style (nestedList|inlineFirstLevel)
minLevel: 1 # Include headings from the specified level
maxLevel: 4 # Include headings up to the specified level
includeLinks: true # Make headings clickable
debugInConsole: false # Print debug info in Obsidian console
```

## Overview

> [!SOURCE] Sources:
> - *[Asynchronous REST Operations in R Plumber with futures](https://gist.github.com/zola-25/ddfd45719fc69d3d987ab63c49790897)*

## Code

- [plumber_asynchronous.R](https://gist.github.com/zola-25/ddfd45719fc69d3d987ab63c49790897#file-plumber_asynchronous-r):

```R
# plumber_asynchronous.R
require(future)
require(uuid)

plan(multiprocess)

defaultPackages <- c("plyr",
		   "dplyr",
		   "dbplyr",
		   "reshape2",
		   "neuralnet",
		   ...whatever you need)
					   
defaultGlobals<-c("workingDir")
						
workingDir<-getwd()

executingFutures <- list()
completedFutures <- list()


#' Being an asynchronous analysis for the provided <analysisId>
#' @serializer unboxedJSON
#' @post /analysis/<analysisId>/run
function(res, analysisId){
  
  analysisId<-as.integer(analysisId)
  
  uniqueId<-UUIDgenerate()
  
  f<-future(
    {
        setwd(workingDir)
		source("./analysis.R")
      
		analysisResult <- runAnalysis(analysisId) # Run anything you like as long as it is in a package or sourced
            
		return(list(
			completedLocation=paste0("/resource/", uniqueId, "/result"),
			result=analysisResult))
    }, 
    globals=c(defaultGlobals,
              "analysisId",
              "uniqueId"), 
    packages=c(defaultPackages)
  )
  
  
  executingFutures[[as.character(uniqueId)]] <<- f
  
  return(resourceAcceptedResponse(res, uniqueId))
  
}

resourceAcceptedResponse <- function(res, uniqueId) {
  
  queueLocation <- paste0("/queuedResource/", uniqueId, "/status")
  res$status <- 202
  res$setHeader("location", queueLocation)
  return(list(message=paste0("This resource is being created. Keep checking back at GET ", queueLocation, ", when completed you will be redirected to the completed resource"),
              location=queueLocation))
}



#' @serializer unboxedJSON
#' @get /queuedResource/<uniqueId>/status
function(res, uniqueId){

  executingFuture<-executingFutures[[uniqueId]]
  if(!is.null(executingFuture)){
    
    if(resolved(executingFuture)) {
      
	#executingFuture is no longer executing and has resolved

	# move from executing to resolved list
	executingFutures[[as.character(uniqueId)]] <<- NULL
	completedFutures[[as.character(uniqueId)]] <<- executingFuture
      
	return(resourceCompletedRedirect(res, executingFuture))
      
    } else {
	
      # still executing
      return(resourceAcceptedResponse(res, uniqueId))
	    
    }
  }
    
  resolvedFuture <- completedFutures[[uniqueId]]
  
  if(is.null(resolvedFuture)) {
	
    return(resourceNotFoundResponse(res, uniqueId))
  }
  
  return(resourceCompletedRedirect(res, resolvedFuture))
}



resourceCompletedRedirect <- function (res, f) {
  
  futureValue <- value(f)
  res$setHeader("location", futureValue$completedLocation)
  res$status <- 303 
	
  return(list(message=paste0("Redirecting to completed resource location ", futureValue$completedLocation),
              location=futureValue$completedLocation))
}


resourceNotFoundResponse <- function(res, uniqueId) {

  res$status <- 404
  return(list(message=paste0("Resource with ID ", uniqueId, " not found. Cache may have expired, please try recreating the resource.")))
}



#' @serializer unboxedJSON
#' @get /resource/<uniqueId>/result
function(res, uniqueId){
  
  if(is.null(uniqueId)) {
    res$status = 404
    return(list(message="{uniqueId} not provided. Format is GET /resource/{uniqueId}/result to retrieve completed resources"))
  }
  
  f <- completedFutures[[as.character(uniqueId)]]
  if(is.null(f)) {
    return(resourceNotFoundResponse(res, uniqueId))
  }
  
  return (value(f)$result)
}
```


## Usage

How to use this code:

1.
2.
3.

## Notes

Additional notes about the code.

***

## Appendix

*Note created on [[2025-12-20]] and last modified on [[2025-12-20]].*

### See Also

- [[MOC - R]] - R programming language
- [[MOC - Web Development]] - API development context
- [[MOC - Development]] - Async programming patterns

### Backlinks

```dataview
LIST FROM [[R - Async Plumber API]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025

