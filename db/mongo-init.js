db = db.getSiblingDB('nodeflix');

db.createCollection('movies');
db.createCollection('series');

print('Mongo database creation completed...');