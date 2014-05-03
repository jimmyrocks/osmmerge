-- Create a view linking probable matched based on the origin import id for items that
-- have been validated in the USGS Navigator project
CREATE MATERIALIZED VIEW matched_nodes_validated AS
SELECT
  nodes.id as usgs_id,
  nodes.version as usgs_version,
  nodes.tstamp as usgs_tstamp,
  nodes.tags as usgs_tags,
  nodes.geom as usgs_geom,
  osm_nodes.id as osm_id,
  osm_nodes.version as osm_version,
  osm_nodes.tstamp as osm_tstamp,
  osm_nodes.tags as osm_tags,
  osm_nodes.geom as osm_geom,
  ST_Distance(nodes.geom::geography, osm_nodes.geom::geography) as distance
FROM
  nodes JOIN osm_nodes
  ON
    nodes.tags->'GAZ_ID' = osm_nodes.tags->'gnis:feature_id'
WHERE nodes.tags->'Validated'='1';

-- Create a spatial index for faster queries
CREATE INDEX matched_nodes_validated_usgs_index ON  matched_nodes_validated USING gist (usgs_geom);
ANALYZE  matched_nodes_validated;
VACUUM  matched_nodes_validated;
