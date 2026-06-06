```R

pkgload::load_all(file.path(dirname(this.path::this.path()), "../"))
parcel <- get_reapi_parcel()
geom <- parcel$geometry
geom_bbox <- sf::st_bbox(geom)

service <- arcgislayers::arc_open(
  "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer"
)

layers <- arcgislayers::get_all_layers(service)
layers <- layers$layers
tables <- layers$tables

layer_28 <- layers$`28`

filter_qry <- arcgislayers::prepare_spatial_filter(
  filter_geom = geom,
  crs = sf::st_crs(layer_28),
  predicate = "intersects"
)

pbf_request <- httr2::request(layer_28$url) |>
  httr2::req_url_path_append("query") |>
  httr2::req_url_query(
    "where" = "1=1",
    "outFields" = "*",
    "f" = "pbf",
    !!!filter_qry
  )

pbf_response <- httr2::req_perform(pbf_request)
pbf_response

pbf_response_file <- file.path("dev", "pbf_response.pbf")
pbf_response <- httr2::req_perform(pbf_request, path = pbf_response_file, verbosity = 3L)
pbf_response

# test <- RProtoBuf::unserialize_pb(connection = file(pbf_response_file))
# test

pbf_response_raw <- httr2::resp_body_raw(pbf_response)

pbf_response_parsed <- arcpbf::resp_body_pbf(pbf_response)

layer_0 <- layers$`0`

filter_qry_0 <- arcgislayers::prepare_spatial_filter(
  filter_geom = geom,
  crs = sf::st_crs(layer_0),
  predicate = "intersects"
)

pbf_request_0 <- httr2::request(layer_0$url) |>
  httr2::req_url_path_append("query") |>
  httr2::req_url_query(
    "where" = "1=1",
    "outFields" = "*",
    "f" = "pbf",
    !!!filter_qry_0
  )

pbf_response_0 <- httr2::req_perform(pbf_request_0)
pbf_response_0

pbf_response_parsed_0 <- arcpbf::resp_body_pbf(pbf_response_0)
pbf_response_parsed_0
mapview::mapview(pbf_response_parsed_0)



nwi_service <- arcgislayers::arc_open(
  "https://fwspublicservices.wim.usgs.gov/wetlandsmapservice/rest/services/Wetlands/MapServer"
)

nwi_layers <- arcgislayers::get_all_layers(nwi_service)
nwi_tables <- nwi_layers$tables
nwi_layers <- nwi_layers$layers

nwi_layer_0 <- nwi_layers$`0`

nwi_filter_qry_0 <- arcgislayers::prepare_spatial_filter(
  filter_geom = geom,
  crs = sf::st_crs(nwi_layer_0),
  predicate = "intersects"
)

nwi_pbf_request_0 <- httr2::request(nwi_layer_0$url) |>
  httr2::req_url_path_append("query") |>
  httr2::req_url_query(
    "where" = "1=1",
    "outFields" = "WETLAND_TYPE,ATTRIBUTE,ACRES,WETLAND_CODE,SYSTEM,SUBSYSTEM,CLASS",
    "f" = "pbf",
    !!!nwi_filter_qry_0
  )

nwi_pbf_response_0 <- httr2::req_perform(nwi_pbf_request_0)
nwi_pbf_response_0

nwi_pbf_response_parsed_0 <- arcpbf::resp_body_pbf(nwi_pbf_response_0)
nwi_pbf_response_parsed_0
mapview::mapview(nwi_pbf_response_parsed_0)

```