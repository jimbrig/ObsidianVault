---
creation_date: 2026-06-04
modification_date: 2026-06-04
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: GDAL Vector Commands
tags:
  - Type/List
  - Status/Complete
  - Topic/Geospatial
  - Topic/Development
aliases:
  - GDAL Vector Commands
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Vector commands

> [!SOURCE]
> [GDAL Programs > Vector Commands](https://gdal.org/en/stable/programs/index.html#vector-commands)

Single operations:

- [gdal vector](https://gdal.org/en/stable/programs/gdal_vector.html#gdal-vector): Entry point for vector commands  
- [gdal vector buffer](https://gdal.org/en/stable/programs/gdal_vector_buffer.html#gdal-vector-buffer): Compute a buffer around geometries of a vector dataset
- [gdal vector check-coverage](https://gdal.org/en/stable/programs/gdal_vector_check_coverage.html#gdal-vector-check-coverage): Check a polygon coverage for validity
- [gdal vector check-geometry](https://gdal.org/en/stable/programs/gdal_vector_check_geometry.html#gdal-vector-check-geometry): Check a dataset for invalid or non-simple geometries
- [gdal vector clean-coverage](https://gdal.org/en/stable/programs/gdal_vector_clean_coverage.html#gdal-vector-clean-coverage): Remove gaps and overlaps in a polygon dataset
- [gdal vector clip](https://gdal.org/en/stable/programs/gdal_vector_clip.html#gdal-vector-clip): Clip a vector dataset
- [gdal vector combine](https://gdal.org/en/stable/programs/gdal_vector_combine.html#gdal-vector-combine): Combine geometries into collections
- [gdal vector concat](https://gdal.org/en/stable/programs/gdal_vector_concat.html#gdal-vector-concat): Concatenate vector datasets
- [gdal vector concave-hull](https://gdal.org/en/stable/programs/gdal_vector_concave_hull.html#gdal-vector-concave-hull): Compute the concave hull of geometries of a vector dataset
- [gdal vector convert](https://gdal.org/en/stable/programs/gdal_vector_convert.html#gdal-vector-convert): Convert a vector dataset
- [gdal vector convex-hull](https://gdal.org/en/stable/programs/gdal_vector_convex_hull.html#gdal-vector-convex-hull): Compute the convex hull of geometries of a vector dataset
- [gdal vector create](https://gdal.org/en/stable/programs/gdal_vector_create.html#gdal-vector-create): Create a vector dataset
- [gdal vector edit](https://gdal.org/en/stable/programs/gdal_vector_edit.html#gdal-vector-edit): Edit metadata of a vector dataset
- [gdal vector explode-collections](https://gdal.org/en/stable/programs/gdal_vector_explode_collections.html#gdal-vector-explode-collections): Explode geometries of type collection of a vector dataset
- [gdal vector export-schema](https://gdal.org/en/stable/programs/gdal_vector_export_schema.html#gdal-vector-export-schema): Export the OGR_SCHEMA from a vector dataset
- [gdal vector filter](https://gdal.org/en/stable/programs/gdal_vector_filter.html#gdal-vector-filter): Filter a vector dataset
- [gdal vector grid](https://gdal.org/en/stable/programs/gdal_vector_grid.html#gdal-vector-grid): Create a regular grid from scattered points
- [gdal vector info](https://gdal.org/en/stable/programs/gdal_vector_info.html#gdal-vector-info): Get information on a vector dataset
- [gdal vector index](https://gdal.org/en/stable/programs/gdal_vector_index.html#gdal-vector-index): Create a vector index of vector datasets
- [gdal vector layer-algebra](https://gdal.org/en/stable/programs/gdal_vector_layer_algebra.html#gdal-vector-layer-algebra): Perform algebraic operation between 2 layers.
- [gdal vector make-point](https://gdal.org/en/stable/programs/gdal_vector_make_point.html#gdal-vector-make-point): Create point geometries from coordinate fields
- [gdal vector make-valid](https://gdal.org/en/stable/programs/gdal_vector_make_valid.html#gdal-vector-make-valid): Fix validity of geometries of a vector dataset
- [gdal vector materialize](https://gdal.org/en/stable/programs/gdal_vector_materialize.html#gdal-vector-materialize): Materialize a piped dataset on disk to increase the efficiency of the following steps
- [gdal vector partition](https://gdal.org/en/stable/programs/gdal_vector_partition.html#gdal-vector-partition): Partition a vector dataset into multiple files
- [gdal vector rasterize](https://gdal.org/en/stable/programs/gdal_vector_rasterize.html#gdal-vector-rasterize): Burns vector geometries into a raster
- [gdal vector pipeline read](https://gdal.org/en/stable/programs/gdal_vector_read.html#gdal-vector-read): Read a vector dataset (pipeline only)
- [gdal vector rename-layer](https://gdal.org/en/stable/programs/gdal_vector_rename_layer.html#gdal-vector-rename-layer): Rename layer(s) of a vector dataset
- [gdal vector reproject](https://gdal.org/en/stable/programs/gdal_vector_reproject.html#gdal-vector-reproject): Reproject a vector dataset
- [gdal vector segmentize](https://gdal.org/en/stable/programs/gdal_vector_segmentize.html#gdal-vector-segmentize): Segmentize geometries of a vector dataset
- [gdal vector select](https://gdal.org/en/stable/programs/gdal_vector_select.html#gdal-vector-select): Select a subset of fields from a vector dataset.
- [gdal vector set-field-type](https://gdal.org/en/stable/programs/gdal_vector_set_field_type.html#gdal-vector-set-field-type): Modify the type of a field of a vector dataset
- [gdal vector set-geom-type](https://gdal.org/en/stable/programs/gdal_vector_set_geom_type.html#gdal-vector-set-geom-type): Modify the geometry type of a vector dataset
- [gdal vector simplify](https://gdal.org/en/stable/programs/gdal_vector_simplify.html#gdal-vector-simplify): Simplify geometries of a vector dataset
- [gdal vector simplify-coverage](https://gdal.org/en/stable/programs/gdal_vector_simplify_coverage.html#gdal-vector-simplify-coverage): Simplify shared boundaries of a polygonal vector dataset
- [gdal vector sort](https://gdal.org/en/stable/programs/gdal_vector_sort.html#gdal-vector-sort): Spatially sort a vector dataset
- [gdal vector sql](https://gdal.org/en/stable/programs/gdal_vector_sql.html#gdal-vector-sql): Apply SQL statement(s) to a dataset
- [gdal vector swap-xy](https://gdal.org/en/stable/programs/gdal_vector_swap_xy.html#gdal-vector-swap-xy): Swap X and Y coordinates of geometries of a vector dataset
- [gdal vector update](https://gdal.org/en/stable/programs/gdal_vector_update.html#gdal-vector-update): Update an existing vector dataset with an input vector dataset
- [gdal vector pipeline write](https://gdal.org/en/stable/programs/gdal_vector_write.html#gdal-vector-write): Write a vector dataset (pipeline only)

Pipelines:

- [gdal vector pipeline](https://gdal.org/en/stable/programs/gdal_vector_pipeline.html#gdal-vector-pipeline): Process a vector dataset applying several steps

and the above:

- [gdal vector pipeline read](https://gdal.org/en/stable/programs/gdal_vector_read.html#gdal-vector-read): Read a vector dataset (pipeline only)
- [gdal vector pipeline write](https://gdal.org/en/stable/programs/gdal_vector_write.html#gdal-vector-write): Write a vector dataset (pipeline only)

## Notes

Of particular interest to me from the available commands:

- `gdal vector export-schema`
- `gdal vector sort --method hilbert`
- `gdal vector partition`
- `gdal vector check-valid`
- `gdal vector concat`
- `gdal vector materialize`
- `gdal vector index`

***

## Appendix

*Note created on [[2026-06-04]] and last modified on [[2026-06-04]].*

### See Also

- [[MOC - Geospatial]]
- [[GDAL --optfile]]

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026