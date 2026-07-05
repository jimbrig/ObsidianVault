---
creation_date: 2026-06-16
modification_date: 2026-06-16T11:50:58-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: List - GeoParquet Tools
tags:
  - Type/List
  - Status/Ongoing
  - Topic/Geospatial
  - Topic/DataEngineering
  - Topic/ComputerScience
  - Topic/Development
  - Topic/Tools
  - Topic/Cloud
aliases:
  - GeoParquet Tools
  - List of GeoParquet Tools
  - GeoParquet Tools List
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```


[Parquet](https://parquet.apache.org/)

[geoparquet.org/releases/](https://geoparquet.org/releases/)
[geoparquet.org/convert/](https://geoparquet.org/convert/)



- [[GDAL]] - [(Geo)Parquet GDAL Driver](https://gdal.org/en/stable/drivers/vector/parquet.html)
- [geoparquet-io](https://geoparquet.io/)
- [planetlabs/gpq: Utility for working with GeoParquet](https://github.com/planetlabs/gpq/) | [GPQ - GeoParquet Utility](https://planetlabs.github.io/gpq/)
- [DuckDB – An in-process SQL OLAP database management system](https://duckdb.org/)
	- https://shell.duckdb.org/
	- [Spatial Extension – DuckDB](https://duckdb.org/docs/current/core_extensions/spatial/overview)
	- [httpfs Extension for HTTP and S3 Support – DuckDB](https://duckdb.org/docs/current/core_extensions/httpfs/overview)
- [apache/sedona-db: A single-node analytical database engine with geospatial as a first-class citizen](https://github.com/apache/sedona-db) | [Introducing SedonaDB - Apache Sedona](https://sedona.apache.org/sedonadb/latest/)
- https://do-me.github.io/geoparquet-visualizer/
- [GeoParquet viewer with DuckDB spatial / Éric Mauvière | Observable](https://observablehq.com/@ericmauviere/geoparquet-viewer-with-duckdb-spatial)
- [stac-utils/stac-geoparquet: Convert STAC items between JSON, GeoParquet, pgstac, and Delta Lake.](https://github.com/stac-utils/stac-geoparquet)




- [Browser-based converter](https://geoparquet.org/convert/): powered by the [GPQ](https://github.com/planetlabs/gpq) library, you can convert GeoJSON to GeoParquet and vice-versa, from within your browser.
- [GeoPandas](https://geopandas.org/en/stable/docs/user_guide/io.html#apache-parquet-and-feather-file-formats) (Python) extends the datatypes used by [pandas](https://pandas.pydata.org/) to allow spatial operations on geometric types and supports [reading](https://geopandas.org/en/stable/docs/reference/api/geopandas.read_parquet.html) and [writing](https://geopandas.org/en/stable/docs/reference/api/geopandas.GeoDataFrame.to_parquet.html) GeoParquet.
- [QGIS](https://qgis.org/) Windows and Linux ship with GeoParquet support, and Mac can work installing with [conda](https://docs.conda.io/en/latest/) (from the terminal with conda activated run 'conda config --add channels conda-forge', 'conda install qgis libgdal-arrow-parquet', and then just type 'qgis' in the terminal). The [GeoParquet Downloader Plugin](https://plugins.qgis.org/plugins/qgis_plugin_gpq_downloader/) enables easy streaming downloads from large online GeoParquet datasets.
- [Scribble Maps](https://www.scribblemaps.com/) is a full-featured web app that supports both import & export of GeoParquet.
- [CARTO](https://carto.com/) is a geospatial platform and [supports import](https://docs.carto.com/carto-user-manual/data-explorer/importing-data#supported-formats) of GeoParquet.
- [gpq](https://github.com/planetlabs/gpq) provides a command-line interface to validate and describe any GeoParquet file. It can also convert GeoParquet to and from GeoJSON
- [stac-geoparquet](https://pypi.org/project/stac-geoparquet/) converts [STAC](https://stacspec.org/) catalogs into GeoParquet.
- [Apache Sedona](https://sedona.apache.org/1.4.1/) is a cluster computing system for processing large-scale spatial data that extends existing cluster computing systems like Apache Spark & Apache Flink. It can [load](https://sedona.apache.org/latest-snapshot/tutorial/sql/#load-geoparquet) and [save](https://sedona.apache.org/latest-snapshot/tutorial/sql/#save-geoparquet) GeoParquet with Scala, Java, Python or R.
- [Esri's ArcGIS GeoAnalytics Engine](https://developers.arcgis.com/geoanalytics/) 'delivers spatial analysis to your big data by extending Apache Spark with ready-to-use SQL functions and analysis tools'. It can load or save GeoParquet with the Python library or the Spark plugin, see their [GeoParquet page](https://developers.arcgis.com/geoanalytics/data/data-sources/geoparquet/) for more details. ArcGIS Pro can also read and write GeoParquet with the [Data Interoperability Extension](https://pro.arcgis.com/en/pro-app/latest/help/data/data-interoperability/supported-formats-with-the-data-interoperability-extension.htm)
- [FME: by Safe Software](https://fme.safe.com/) is a no code platform that effortlessly integrates your data, including read and write support for GeoParquet starting in [version 23.1](https://engage.safe.com/support/downloads/)
- [SeerAI's](https://seer.ai/) [Geodesic Platform](https://docs.seerai.space/geodesic) is a cloud-native, planetary scale Spatiotemporal Data Mesh and Data Fusion platform. Geodesic's Boson Service Mesh supports GeoParquet natively and can expose massive GeoParquet datasets as compatible formats to other analytical systems and geospatial software via APIs. All tabular and feature data outputs are written in Parquet/GeoParquet format.
- [Wherobots](https://wherobots.com/) provides a fully-managed cloud spatial data lakehouse that can manage and analyze geospatial data at any scale. All data on Wherobots can be saved in GeoParquet format and cataloged by its [Havasu Spatial Table Format](https://docs.wherobots.services/latest/references/havasu/introduction/).
- [pygeoapi](https://pygeoapi.io/) is a Python server implementation of the OGC API suite of standards. It now supports a [Parquet](https://docs.pygeoapi.io/en/latest/data-publishing/ogcapi-features.html#parquet) provider that allows publishing a GeoParquet file as an OGC API - Features collection.
- [Fused](https://www.fused.io/) is a data analytics platform that enables users to write and deploy Python User Defined Functions (UDFs) behind HTTP endpoints and interactive applications, with great support for geospatial data and GeoParquet.
- [Felt](https://felt.com/) is a cloud-native GIS platform helping users make maps, apps & dashboards in seconds, and supports GeoParquet importing.
- [DuckDB](https://duckdb.org/) is a fast, analytical, portable database, and its [spatial extension](https://duckdb.org/docs/extensions/spatial/overview.html) can read and write GeoParquet files.
- [GeoParquet Tools](https://github.com/cholmes/geoparquet-tools) can check GeoParquet best practices, spatially order GeoParquet files (using DuckDB's Hilbert curve), and partition GeoParquet data.
- Google's [Big Query](https://cloud.google.com/bigquery?hl=en) data warehouse supports [loading](https://cloud.google.com/bigquery/docs/geospatial-data#loading_geoparquet_files) and writing GeoParquet.
- [Atlas](https://atlas.co/) is a browser-based GIS platform with collaboration capabilities that provides visualization and analysis of a variety of formats, including GeoParquet.
- [Kepler GL 3.1](https://kepler-preview.foursquare.com/) is a open source geospatial analysis tool for large-scale data sets, and it can load and display GeoParquet ([source code](https://github.com/keplergl/kepler.gl/releases/tag/v3.1.0)).

## Libraries

- [geoarrow](https://github.com/paleolimbot/geoarrow) (R)
- [sfarrow](https://wcjochem.github.io/sfarrow/index.html) (R)
- [GDAL/OGR](https://gdal.org/drivers/vector/parquet.html) (C++, bindings in several languages)
- [GeoParquet.jl](https://github.com/JuliaGeo/GeoParquet.jl) (Julia)
- [gpq](https://github.com/planetlabs/gpq) (Go and WASM)
- [Fiona](https://github.com/Toblerity/Fiona) (Python - as of version 1.9.4. Note the GeoParquet driver will only be available if your system's GDAL library links libarrow; fiona wheels on PyPI do not include libarrow as it is rather large.)
- [.NET 6 library](https://github.com/bertt/geoparquet) (.NET)
- [C++ example code](https://gist.github.com/jpswinski/13074fc773f92a529f98b274e5ad5283) - see [this discussion topic](https://github.com/opengeospatial/geoparquet/discussions/164) for more info.
- [loaders.gl](https://loaders.gl/docs/modules/parquet/api-reference/parquet-loader) (Javascript)
- [GeoParquet.js](https://github.com/hyparam/geoparquet) (JavaScript)

## Data Providers & Public Data

There are many sources of GeoParquet data, with more and more coming online all the time. If you have or know of a good source of GeoParquet data please let us know!

- [Overture Maps Foundation](https://overturemaps.org/) provides global data across six data themes (addresses, base, buildings, divisions, places, and transportation), using well-partitioned GeoParquet as their primary distribution format across multiple clouds. It consists of billions of features across hundreds of gigabytes.
- [Microsoft](http://microsoft.com/) provides access to all Planetary Computer STAC items as GeoParquet, see this [quickstart guide](https://planetarycomputer.microsoft.com/docs/quickstarts/stac-geoparquet/) for more information. Their [Building Footprints](https://planetarycomputer.microsoft.com/dataset/ms-buildings) are also distributed as GeoParquet.
- [Planet](https://geoparquet.org/planet.com) provides their [RapidAI4EO dataset](https://beta.source.coop/repositories/planet/rapidai4eo/description)'s STAC items as GeoParquet, see the [STAC Browser](https://www.planet.com/data/stac/browser/external/radiantearth.blob.core.windows.net/mlhub/rapidai4eo/stac-v1.0/rapidai4eo_v1_source_pf/collection.json?.language=en&.asset=asset-geoparquet-items) view of the data. They also provide a [data set of field boundaries across all of Europe](https://source.coop/repositories/planet/eu-field-boundaries/description), derived with ML.
- [source.coop](https://beta.source.coop/) provides numerous datasets in [cloud-native geospatial](https://cloudnativegeo.org/) formats, including over 60 [GeoParquet](https://source.coop/repositories?tags=geoparquet). The [Google-Microsoft-OSM Open Buildings - combined by VIDA](https://source.coop/repositories/vida/google-microsoft-osm-open-buildings/description) has over 2.2 billion building footprints across the globe. And the [fiboa organization](https://source.coop/fiboa) provides numerous field boundary datasets from a variety of countries, all in GeoParquet.
- [Foursquare's Open Source Places](https://docs.foursquare.com/data-products/docs/access-fsq-os-places) provides over 100 million points of interest, available as [GeoParquet on Hugging Face](https://huggingface.co/datasets/foursquare/fsq-os-places).
- [emotional.byteroad.net](https://emotional.byteroad.net/catalogue) provides most of its +100 datasets in GeoParquet. The GeoParquet files all linked through the metadata records.


***

## Appendix

*Note created on [[2026-06-16]] and last modified on [[2026-06-16]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
