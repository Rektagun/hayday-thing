const express = require("express");
const neo4j = require("neo4j-driver");
const cors = require("cors");
const axios = require('axios').default;
const app = express();
require('dotenv').config()
app.use(cors());
app.use(express.json());

// TODO: I need to get all the data from the database. (WHOLE_DATABASE)
// TODO: Send that to the frontend.
// TODO: Filter it based on the user's level. (user_level)


let cachedData = null;
const retrieveData = async () => {
  const NEO4J_URI = process.env.NEO4J_URI
  const NEO4J_USERNAME = process.env.NEO4J_USERNAME
  const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD
  let driver

  try {
    driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD))
    const serverInfo = await driver.getServerInfo()
    console.log('Connection established...')
    console.log(serverInfo)
    console.log('Getting data from database...')
    cachedData = await driver.executeQuery('MATCH p=()-[]-() RETURN p;')
    if (cachedData) {
      console.log('Got data from database...', cachedData.records);
    }
  } catch (err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`)
  }
}

retrieveData();

app.get('/api/data', (req, res) => {
  if (cachedData) {
    res.json(cachedData);
  }
  else {
    console.log("Data not loaded yet.");
  }
});

// function getAllData() {
//   const WHOLE_DATABASE = await driver.executeQuery(
//     'MATCH p=()-[]-() RETURN p LIMIT 25;',
//   )
//   // const { records, summary, keys } = await driver.executeQuery(
//   //   'MATCH p=()-[]-() RETURN p LIMIT 25;',
//   // )
// }

// function getDataFromFrontend() {
//   try {
//     const result = await driver.executeQuery(
//       `MATCH p=(n:Item)-[]->() WHERE n.level <= ${user_level} RETURN DISTINCT p`,
//     );
//     console.log(result);
//   } catch (err) {
//     console.log(`Connection error\n${err}\nCause: ${err.cause}`)
//   }
// }



// Summary information
// console.log(
//   WHOLE_DATABASE
//   // `>> The query ${summary.query.text} ` +
//   // `returned ${records.length} records ` +
//   // `in ${summary.resultAvailableAfter} ms.`
// )

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
