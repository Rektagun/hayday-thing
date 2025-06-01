// URI='neo4j+s://afe81a2a.databases.neo4j.io'
// USER='neo4j'
// PASSWORD='VcKQNmXMCW3T2OR_-URhFumMDoFrQWxqnB1LkVfOHEc'

const express = require("express");
const neo4j = require("neo4j-driver");
const cors = require("cors");
const app = express();
require('dotenv').config()

app.use(cors());
app.use(express.json());

const URI = process.env.URI
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
let driver

app.get("/", async (req, res) => {
  // const user_level = req.query.value;

  // try {
  //   driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
  //   const serverInfo = await driver.getServerInfo()
  //   console.log('Connection established')
  //   console.log(serverInfo)
  //   const result = await driver.executeQuery(
  //     `MATCH p=(n:Item)-[]->() WHERE n.level <= ${user_level} RETURN DISTINCT p`,
  //   );
  //   console.log(result);
  // } catch (err) {
  //   console.log(`Connection error\n${err}\nCause: ${err.cause}`)
  // }

  // try {
  //   const result = await driver.executeQuery(
  //     `MATCH p=(n:Item)-[]->() WHERE n.level <= ${user_level} RETURN DISTINCT p`,
  //   );
  //
  //   //const itemDetails = result.records.map((record) => {
  //   //  const node = record.get("p");
  //   //  return {
  //   //    id: node.identity.low,
  //   //    name: node.properties.name,
  //   //    maxPrice: node.properties.maxPrice.low,
  //   //    level: node.properties.level.low,
  //   //    type: node.properties.type,
  //   //    xp: node.properties.xp.low,
  //   //    imageUrl: node.properties.imageUrl,
  //   //  };
  //   //});
  //
  //   driver.close();
  //
  //   console.log(`User level received: ${user_level}`);
  //   //console.log(itemDetails)
  //
  //   //TODO: uncomment the working things, and need to reiterate on the new
  //   //result from the new query.
  //
  //   // console.log(result.records);
  //
  //   //res.status(200).json(itemDetails)
  //
  // } catch (err) {
  //   console.log(`Connection error\n${err}\nCause: ${err.cause}`);
  //   res.status(404);
  // }
});

// (async () => {
//   const URI = "neo4j+s://afe81a2a.databases.neo4j.io";
//   const USER = "neo4j";
//   const PASSWORD = "VcKQNmXMCW3T2OR_-URhFumMDoFrQWxqnB1LkVfOHEc";
//   let driver;
//   try {
//     driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
//     // console.log(await driver.executeQuery('MATCH (n) RETURN n LIMIT 1'));
//     // driver.close();
//   } catch (err) {
//     console.log(`Connection error\n${err}\nCause: ${err.cause}`);
//   }
// })();

app.listen(3001, () => {
  console.log("Server running on port 3001");
});

// Variables:
// 0. User's exp level in the game.
//    - Only show those items.
// 1. What items to fetch?
//    - Some other info about it?

// TODO [ RECIEVE DATA FROM FRONTEND ]
// TODO [ FIGURE OUT HOW I'LL HANDLE TWO THINGS AT ONCE, THE SNED ING OF LEVEL
// AND THE FETCHING OF DATA ]

// TODO [ CLEAN DATA AND MAKE IT USEFULL ]

// Que. What data to request?
// Ans. Ask the user for items needed and then get back with that info.
//    - Mostly everything in the database, but only required items.
//    - Remove stupid things from the results.
//    - Save that data nicely to send to the frontend.

// TODO [ SEND DATA TO FRONTEND ]
