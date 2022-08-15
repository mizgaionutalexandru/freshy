// This file will ran to import or delete all the data from a collection
// For now, this collection will be the items one
const fs = require('fs');
const mongoose = require('mongoose');
const Item = require('./../models/itemsModel');
require('dotenv').config({
  path: './config.env',
});

mongoose
  .connect(process.env.DB.replace('<password>', process.env.DB_PASS))
  .then(() => {
    console.log('Connection to DB has been established! ✅');
  })
  .catch((err) => {
    console.log('Connection to DB has failed ❌❌❌');
    console.log(err);
  });

// Read the JSON data from the file
const items = JSON.parse(fs.readFileSync(`${__dirname}/items.json`, 'utf-8'));

const importData = async () => {
  Item.create(items)
    .then(() => {
      console.log('Data loaded! ✅');
    })
    .catch((err) => {
      console.log('Erorr importing data! ❌');
      console.log(err);
    })
    .finally(() => {
      process.exit();
    });
};

const deleteData = async () => {
  Item.deleteMany({})
    .then(() => {
      console.log('Data deleted! ✅');
    })
    .catch((err) => {
      console.log('Erorr deleting data! ❌');
      console.log(err);
    })
    .finally(() => {
      process.exit();
    });
};

if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();
