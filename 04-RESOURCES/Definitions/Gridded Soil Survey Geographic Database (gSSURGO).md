---
creation_date: 2026-07-09
modification_date: 2026-07-09
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: Definition note for Gridded Soil Survey Geographic Database (gSSURGO)
tags:
  - Type/Definition
  - Status/WIP
  - Topic/Geospatial
aliases:
  - gSSURGO
  - Gridded Soil Survey Geographic Database
  - Gridded SSURGO
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE] Sources:
> - [Gridded Soil Survey Geographic (gSSURGO) Database | Natural Resources Conservation Service](https://www.nrcs.usda.gov/resources/data-and-reports/gridded-soil-survey-geographic-gssurgo-database)

> [!TIP] Data:
> - [soils | Powered by Box](https://nrcs.app.box.com/v/soils/folder/233395259341)
> - [soils | Powered by Box](https://nrcs.app.box.com/v/soils/folder/233398887779)


**Gridded Soil Survey Geographic Database** ...

## Resources

### User Guide

Below is an embedded PDF document from [gSSURGO_UserGuide_July2020.pdf](https://www.nrcs.usda.gov/sites/default/files/2022-08/gSSURGO_UserGuide_July2020.pdf):

> [!PDF]- PDF
> ![[gSSURGO_UserGuide_July2020.pdf]]

### The `Valu1` (Value Added Look Up) Table

Included with the gSSURGO database, but not a part of the standard SSURGO dataset is a table called Valu1. This table contains 57 pre-summarized or “ready to map” attributes derived from the official SSURGO database. These attribute data are pre-summarized to the map unit level using best-practice generalization methods intended to meet the needs of most users. The generalization methods include map unit component weighted averages and percent of the map unit meeting a given criteria. These themes were prepared to better meet the mapping needs of users of soil survey information and can be used with both SSURGO and gridded SSURGO (gSSURGO) datasets. Below is a partial list of the data found in the valu1 table.

- Soil organic carbon - weighted average (g C/m2)  
     
- Available water storage - weighted average (mm)  
     
- National Commodity Crop Productivity Index (NCCPI) Version 3 - weighted average index for major components (Dobos, Sinclair, and Robotham, 2012)  
     
- Root-zone depth of commodity crops - weighted average (cm) major components (Dobos et al., 2012)  
     
- Available water storage within the root-zone depth - weighted average (mm) major components  
     
- Drought-vulnerable soil landscapes (The map unit is identified as either drought vulnerable or not drought vulnerable. Drought-vulnerable soil landscape map units have 152 millimeters (6 inches) or less root zone available water storage for major components.)  
     
- Potential wetland soil landscapes (PWSL Version 1) - percentage of the map unit that meets the criteria for a potential wetland soil landscape (see table metadata for detailed criteria)

Below is an embedded PDF document from [gSSURGO Value Added Look Up Valu1 Table Column Descriptions.pdf](https://www.nrcs.usda.gov/sites/default/files/2022-08/gSSURGO%20Value%20Added%20Look%20Up%20Valu1%20Table%20Column%20Descriptions.pdf):

> [!PDF]- PDF
> ![[gSSURGO Value Added Look Up Valu1 Table Column Descriptions.pdf]]


### Metadata

The metadata for [[Soil Survey Geographic Database (SSURGO)|SSURGO]]/STATSGO2 contains information about the database structure and contents that are also relevant to gSSURGO:

> [!SOURCE]
> [SSURGO/STATSGO2 Structural Metadata and Documentation](https://www.nrcs.usda.gov/resources/data-and-reports/ssurgo/stats2go-metadata "SSURGO/STATSGO2 Metadata")

SSURGO/STATSGO2 Metadata links and reports.

Exports from the Soil Data Mart are delivered in what is referred to as Soil Survey Geographic Database (SSURGO) format. The following documents, diagrams, and reports describe the SSURGO standard and STATSGO2, as well as the tools and procedures that are necessary to effectively use this data.

- [What is SSURGO?](https://www.nrcs.usda.gov/resources/data-and-reports/soil-survey-geographic-database-ssurgo "Soil Survey Geographic Database (SSURGO)") (Includes description, ordering information, and recommended data citation)
- [What is STATSGO2?](https://www.nrcs.usda.gov/resources/data-and-reports/description-of-statsgo2-database "Description of STATSGO2 Database")
- SSURGO Soil Map Coverage versus the U.S. General Soil Map Coverage (SSURGO versus STATSGO2) _**(coming soon)**_

PDF files require Acrobat Reader.

[SSURGO Data Packaging and Use.](https://www.nrcs.usda.gov/sites/default/files/2022-08/SSURGO-Data-Packaging-and-Use-6.pdf "SSURGO-Data-Packaging-and-Use-6.pdf") (105.6 KB)

This document describes the format of a SSURGO export file, and discusses some of the applications available for using this data.

[Diagram showing the SSURGO data model.](https://www.nrcs.usda.gov/sites/default/files/2022-08/SSURGO-Data-Model-Diagram-Part-1_0_0.pdf "SSURGO-Data-Model-Diagram-Part-1_0.pdf") (30.56 KB)

This diagram shows the soil tabular and spatial data tables in the SSURGO standard, and how those tables are related. Only primary and foreign key columns are included in this diagram. See the report titled “SSURGO Metadata – Table Columns” for a complete listing of all columns in each table. The information in this diagram is also available in non-graphical format in the report titled “SSURGO Metadata – Relationships”.

[Diagram of the SSURGO data model - part 2.](https://www.nrcs.usda.gov/sites/default/files/2022-08/SSURGO-Data-Model-Diagram-Part-2.pdf "SSURGO-Data-Model-Diagram-Part-2.pdf") (18.06 KB)

This diagram shows the static metadata and Soil Data Viewer related tables in the SSURGO standard, and how those tables are related. Only primary and foreign key columns are included in this diagram. See the report titled “SSURGO Metadata – Table Columns” for a complete listing of all columns in each table. The information in this diagram is also available in non-graphical format in the report titled “SSURGO Metadata – Relationships”.

[SSURGO metadata tables and columns report.](https://www.nrcs.usda.gov/sites/default/files/2022-08/SSURGO-Metadata-Tables-and-Columns-Report.pdf "SSURGO-Metadata-Tables-and-Columns-Report.pdf") (289.7 KB)

This report includes table attributes?  
Table Physical Name  
Table Label  
Table Description

This report includes column attributes?  
Default Sequence  
Column Physical Name  
Column Label  
Logical Data Type  
Physical Data Type  
Not Null?  
Field Size, if any  
Precision, if any  
Minimum Allowable Value, if any  
Maximum Allowable Value, if any  
Units of Measure, if any  
Corresponding Domain Name, if any

[SSURGO Metadata Table and Column Descriptions Report](https://www.nrcs.usda.gov/sites/default/files/2022-08/SSURGO-Metadata-Table-Column-Descriptions-Report.pdf "SSURGO-Metadata-Table-Column-Descriptions-Report.pdf") (313.49 KB)

This report includes table attributes:  
Table Physical Name  
Table Label

This report includes column attributes:  
Column Physical Name  
Column Label  
Column Description

[SSURGO metadata domains report](https://www.nrcs.usda.gov/sites/default/files/2022-08/SSURGO-Metadata-Domains-Report.pdf "SSURGO-Metadata-Domains-Report.pdf") (1.1 MB)

The report includes domain attribute.  
Domain Name

This report includes domain member attributes.  
Sequence (used to sequence the members of the corresponding domain)  
Obsolete? (Is this domain member considered to be obsolete?)  
Choice ID (an integer number that uniquely identifies the corresponding domain member)  
Choice Data Entry Text (the shorter, typically lower case string that uniquely identifies the corresponding domain member)  
Choice Label (the longer, typically mixed case straing that uniquely identifies the corresponding domain member)  
Choice Description

[SSURGO Metadata - Unique Constraints Report](https://www.nrcs.usda.gov/sites/default/files/2022-08/SSURGO-Style-Metadata-Unique-Constraints-Report.pdf "SSURGO-Style-Metadata-Unique-Constraints-Report.pdf") (12.12 KB)

This report includes all unique constraints in a SSURGO database, i.e. primary keys and alternate unique constraints. This report includes table attributes Table Physical Name and Table Label, the physical name of the corresponding unique constraint and the physical name of the columns participating in that unique constraint.

[SSURGO Metadata - Relationships Report](https://www.nrcs.usda.gov/sites/default/files/2022-08/SSURGO-Metadata-Relationships-Report.pdf "SSURGO-Metadata-Relationships-Report.pdf") (20.39 KB)

This report includes all relationships in a SSURGO database. For each table, the relationships for which that table is the parent table are listed first, followed by the relationships for which that table is the child table. This makes it easier to find all relationships in which a given table participates, but results in each relationship being listed twice. For each relationship, the physical names of the join columns are included for both tables.

### Recommended Data Citations

#### The Citation for gSSURGO

**State Tile**

Soil Survey Staff. Gridded Soil Survey Geographic (gSSURGO) Database for _State name_. United States Department of Agriculture, Natural Resources Conservation Service. Available online at [https://gdg.sc.egov.usda.gov/](https://gdg.sc.egov.usda.gov/). _Month, day, year_ (FY_year_ official release).

**Conterminous U.S. Tile**

Soil Survey Staff. Gridded Soil Survey Geographic (gSSURGO) Database for the Conterminous United States. United States Department of Agriculture, Natural Resources Conservation Service. Available online at [https://gdg.sc.egov.usda.gov/](https://gdg.sc.egov.usda.gov/). _Month, day, year_ (YYYYMM official release).

**National Collection of Tiles**

Soil Survey Staff. Gridded Soil Survey Geographic (gSSURGO) Database for the United States of America and the Territories, Commonwealths, and Island Nations served by the USDA-NRCS. United States Department of Agriculture, Natural Resources Conservation Service. Available online at [https://gdg.sc.egov.usda.gov/](https://gdg.sc.egov.usda.gov/). _Month, day, year_ (YYYYMM official release).

#### The Citation for the National Value Added Look Up (valu) Table Database

Soil Survey Staff. National Value Added Look Up (valu) Table Database for the Gridded Soil Survey Geographic (gSSURGO) Database for the United States of America and the Territories, Commonwealths, and Island Nations served by the USDA-NRCS. United States Department of Agriculture, Natural Resources Conservation Service. Available online at [https://gdg.sc.egov.usda.gov/](https://gdg.sc.egov.usda.gov/). _Month, day, year_ (YYYYMM official release).

#### Citation Examples

The following examples are for the July 2020 gSSURGO dataset for the State of West Virginia. Such citations should appear in the reference section of your document.

**State Tile**

_Soil Survey Staff. The Gridded Soil Survey Geographic (gSSURGO) Database for West Virginia. United States Department of Agriculture, Natural Resources Conservation Service. Available online at_ [_https://gdg.sc.egov.usda.gov/_](https://gdg.sc.egov.usda.gov/)_. November 16, 2020 (202007 official release)._

**Conterminous U.S. Tile**

_Soil Survey Staff. Gridded Soil Survey Geographic (gSSURGO) Database for the Conterminous United States. United States Department of Agriculture, Natural Resources Conservation Service. Available online at_ [_https://gdg.sc.egov.usda.gov/_](https://gdg.sc.egov.usda.gov/)_. November 16, 2020 (202007 official release)._

**National Collection of Tiles**

_Soil Survey Staff. Gridded Soil Survey Geographic (gSSURGO) Database for the United States of America and the Territories, Commonwealths, and Island Nations served by the USDA-NRCS. United States Department of Agriculture, Natural Resources Conservation Service. Available online at_ [_https://gdg.sc.egov.usda.gov/_](https://gdg.sc.egov.usda.gov/)_. November 16, 2020 (202007 official release)._

See [Citing Our Databases](https://www.nrcs.usda.gov/conservation-basics/soil/citing-our-databases "Citing Our Databases") for recommended citations for other data provided by the USDA Natural Resources Conservation Service and the National Cooperative Soil Survey.

###  Technical Information

To obtain technical information about the use of soil data, please contact the [NRCS State Soil Scientist](https://www.nrcs.usda.gov/conservation-basics/soil/soil-science-contacts "Soil Science Contacts") in your state, or email the [Soils Hotline Staff](mailto:soilshotline@usda.gov?subject=SSURGO%2FgSSURGO).

***
## Appendix

*Note created on [[2026-07-09]] and last modified on [[2026-07-09]].*

### See Also

- [[MOC - Geospatial]]
- [[United States Department of Agriculture (USDA)]] 
- [[Natural Resources Conservation Service (NRCS)]]
- [[Soil Survey Geographic Database (SSURGO)]]
- [[Soil Data Access (SDA)]]
- [[List - Federal Geospatial Data Sources]]
- [[Guide - Geospatial Soil Data]]
- [[R - Soil Maps]]

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
