mkdir -p ../data/osm

dbname_osm=osm
dbfile_osm=../data/osm/colorado-latest.osm.pbf
dbfileUrl_osm=http://download.geofabrik.de/north-america/us/colorado-latest.osm.pbf

dbname_usgs=usgs
dbfile_usgs=../data/usgs/usgs_20140503.osm
# This file is not available for public download, contact jpantoga@usgs.gov for more information

user=$1 # These need to be entered
pass=$2 # "
if [[ -z $1 ]]; then
  read -p "enter a username for the db: " user
fi
if [[ -z $2 ]]; then
  read -p "enter a password for the db: " pass
fi

# Download the required files
curl -L -Sso ../data/pgsnapshot_schema_0.6.sql https://raw.github.com/openstreetmap/osmosis/master/package/script/pgsnapshot_schema_0.6.sql

# Create the databases for them
sudo -u postgres psql -c "CREATE USER $user WITH PASSWORD '$pass'"
sudo -u postgres psql -c "ALTER USER $user WITH SUPERUSER;"

sudo -u postgres createdb -E UTF8 $dbname_osm
sudo -u postgres psql -d $dbname_osm -c "CREATE EXTENSION postgis;"
sudo -u postgres psql -d $dbname_osm -c "CREATE EXTENSION postgis_topology;"
sudo -u postgres psql -d $dbname_osm -c "CREATE EXTENSION hstore;"
sudo -u postgres psql -d $dbname_osm -f ../data/pgsnapshot_schema_0.6.sql

sudo -u postgres createdb -E UTF8 $dbname_usgs
sudo -u postgres psql -d $dbname_usgs -c "CREATE EXTENSION postgis;"
sudo -u postgres psql -d $dbname_usgs -c "CREATE EXTENSION postgis_topology;"
sudo -u postgres psql -d $dbname_usgs -c "CREATE EXTENSION hstore;"
sudo -u postgres psql -d $dbname_usgs -c "CREATE EXTENSION uuid-ossp;"
# http://www.postgresql.org/docs/current/static/postgres-fdw.html
# http://www.postgresql.org/docs/current/static/postgres-fdw.html
#stgres 
sudo -u postgres psql -d $dbname_usgs -c "CREATE EXTENSION postgres_fdw;"
sudo -u postgres psql -d $dbname_usgs -f ../data/pgsnapshot_schema_0.6.sql

# Install Osmosis
mkdir -p ../data/osmosis
cd ../data/osmosis
sudo apt-get -y install unzip openjdk-6-jdk
if [ -a "osmosis-latest.zip" ]; then
  rm osmosis-latest.zip
fi
#curl -O http://bretth.dev.openstreetmap.org/osmosis-build/osmosis-latest.zip
#unzip osmosis-latest.zip
cd ../../scripts

# Import the data with Osmosis
../data/osmosis/bin/osmosis --read-pbf file="../data/$dbfile_osm" --write-pgsql  database="$dbname_osm" user="$user" password="$pass"
../data/osmosis/bin/osmosis --read-xml file="../data/$dbfile_usgs" --write-pgsql  database="$dbname_usgs" user="$user" password="$pass"

# Create views / Run Scripts
sudo -u postgres psql -d $dbname_usgs -f ./post_import.sql
