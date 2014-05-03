mkdir -p ../data

dbname_osm=osm
dbfile_osm=../data/osm/colorado-latest.osm.pbf
dbfileUrl_osm=http://download.geofabrik.de/north-america/us/colorado-latest.osm.pbf

dbname_usgs=usgs
dbfile_usgs=../data/usgs/usgs_20140503.osm
# This file is not available for public download, contact jpantoga@usgs.gov for more information

user=$1 # These need to be entered
pass=$2 # "

# Download the required files
curl -L -Sso https://raw.github.com/openstreetmap/osmosis/master/package/script/pgsnapshot_schema_0.6.sql ../data/pgsnapshot_schema_0.6.sql

# Create the databases for them
sudo -u postgres psql -c "CREATE USER $user WITH PASSWORD '$pass'"
sudo -u postgres psql -c "ALTER USER $user WITH SUPERUSER;"

sudo -u postgres createdb -E UTF8 $dbfile_osm
sudo -u postgres psql -d $osm_dbname -c "CREATE EXTENSION postgis;"
sudo -u postgres psql -d $osm_dbname -c "CREATE EXTENSION postgis_topology;"
sudo -u postgres psql -d $osm_dbname -c "CREATE EXTENSION hstore;"
sudo -u postgres psql -d $osm_dbname -f ../data/pgsnapshot_schema_0.6.sql

sudo -u postgres createdb -E UTF8 $dbfile_usgs
sudo -u postgres psql -d $usgs_dbname -c "CREATE EXTENSION postgis;"
sudo -u postgres psql -d $usgs_dbname -c "CREATE EXTENSION postgis_topology;"
sudo -u postgres psql -d $usgs_dbname -c "CREATE EXTENSION hstore;"
# http://www.postgresql.org/docs/current/static/postgres-fdw.html
# http://www.postgresql.org/docs/current/static/postgres-fdw.html
stgres 
sudo -u posrgres psql -d $usgs_dbname -c "CREATE EXTENTION postgres_fdw;"
sudo -u postgres psql -d $usgs_dbname -f ../data/pgsnapshot_schema_0.6.sql

# Install Osmosis
mkdir -p ../data/osmosis
cd ../data/osmosis
sudo apt-get -y install unzip openjdk-6-jdk
if [ -a "osmosis-latest.zip" ]; then
  rm osmosis-latest.zip
fi
curl -O http://bretth.dev.openstreetmap.org/osmosis-build/osmosis-latest.zip
unzip osmosis-latest.zip
cd ../scripts

# Import the data with Osmosis
../data/osmosis/bin/osmosis --read-pbf file="../data/$osm_dbfile" --write-pgsql  database="$osm_dbname" user="$user" password="$pass"
../data/osmosis/bin/osmosis --read-xml file="../data/$usgs_dbfile" --write-pgsql  database="$usgs_dbname" user="$user" password="$pass"

# Create views / Run Scripts
sudo -u postgres psql -d $usgs_dbname -f ./post_import.sql
exit
