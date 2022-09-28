# Freshy - a fruits&vegetables e-commerce app

![GitHub last commit](https://img.shields.io/github/last-commit/mizgaionutalexandru/freshy?style=flat-square)

A fullstack web application featuring a REST API ([see docs](https://documenter.getpostman.com/view/18017651/2s7ZE4N5EP)) and a User Interface to see all the items, add them to the shopping cart and place an order. It has pagination, item filtering, sorting and many more.

It was built using Express.js (node.js), Mongoose (mongoDB) and Pug for the backend, HTML, CSS and Javascript for the frontend.

## How to start after forking/ downloading
First install all the dependencies from the root folder but also ./client and ./server.
Then create a file called `config.env` in the ./server folder. You will need to define the DB_PASS, DB_USER, DB, NODE_ENV='development' and PORT=3000. These will help you connect to your own mongo DB and start the server. After that you can use import your items:
```console
$ node ./server/dev-data/importData.js --import
```
Now to check out the app you can simply run `$ npm start` from the root folder and your server will be up on port [3000](http://localhost:3000/). 

If you wanna play with the frontend (./client) you can start both servers using `$ npm run both`.


## Things that can be added later

- Authentification and user roles (customer, delivery, admin)
- Order history
- Order placement email confirmation
- Customer notes for each item in their shopping cart
- Nutrients for each product
- Category filter (plus herbs and spices)
- Different currencies and measure units

## Contact me by [mail](mailto:mizgaionutalexandru@gmail.com)

    mizgaionutalexandru@gmail.com
