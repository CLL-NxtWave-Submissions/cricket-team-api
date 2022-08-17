const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json()); // To parse JSON data in request body

const cricketTeamDBFilePath = path.join(__dirname, "cricketTeam.db");
const sqliteDBDriver = sqlite3.Database;

let cricketTeamDBConnectionObj = null;

const initializeDBAndServer = async () => {
  try {
    cricketTeamDBConnectionObj = await open({
      filename: cricketTeamDBFilePath,
      driver: sqliteDBDriver,
    });

    // Control flow reaches here only when
    // a db connection object is successfully
    // returned without any exceptions. Only
    // then, Node.js server instance is started
    // to listen on port 3000.
    app.listen(3000, () => {
      console.log(
        "Server successfully started and is listening on port 3000 !"
      );
    });
  } catch (exception) {
    console.log(`Error Initializing DB: ${exception.message}`);
    process.exit(1); // Don't want server process to start when
    // there is an issue connecting with sqlite
    // db instance.
  }
};

initializeDBAndServer();

// Cricket Team API end-points for client to
// carry out different data operations on data
// in the backend sqlite DB.

// End-Point 1: To fetch all player data from sqlite DB
//              and send it as response to a GET request
//              from client.
app.get("/players/", async (req, res) => {
  const getAllPlayersSQLQuery = `
    SELECT *
    FROM cricket_team;
    `;

  const allPlayerData = await cricketTeamDBConnectionObj.all(
    getAllPlayersSQLQuery
  );
  res.send(allPlayerData);
});

module.exports = app;
