db = db.getSiblingDB('nodeflix');

db.createCollection('movies');
db.createCollection('series');
db.createCollection('profile_pictures');

print('Mongo database creation completed...');