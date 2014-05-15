-- https://wiki.postgresql.org/wiki/What's_new_in_PostgreSQL_9.3#Writeable_Foreign_Tables
CREATE SERVER osm_fdw FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host 'localhost', dbname 'osm');
CREATE USER MAPPING FOR PUBLIC SERVER osm_fdw OPTIONS (password '');
CREATE FOREIGN TABLE osm_nodes (
  id           bigint,
  version      integer,
  user_id      integer,
  tstamp       timestamp without time zone,
  changeset_id bigint,
  tags         hstore,
  geom         geometry(Point,4326)
) SERVER osm_fdw OPTIONS (table_name 'nodes');

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

-- Create the change tracking table
--DROP TABLE approved_nodes;
CREATE TABLE approved_nodes (
  usgs_id integer NOT NULL,
  osm_id integer NOT NULL,
  tags hstore,
  geom geometry(Point,4326),
  comments text,
  id uuid,
  in_osm boolean,
  nodes_match boolean
);
