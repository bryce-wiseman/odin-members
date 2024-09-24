import pg from "pg";

const USERNAME = process.env.USERNAME
const PASSWORD = process.env.PASSWORD

const HOST = process.env.HOST

const SQL = `CREATE TABLE IF NOT EXISTS members (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
first_name VARCHAR (100),
last_name VARCHAR (100),
username VARCHAR (100) UNIQUE,
password VARCHAR (100),
membership VARCHAR (100),
admin VARCHAR (100)
);
  
CREATE TABLE IF NOT EXISTS posts (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
title VARCHAR (200),
content VARCHAR (500),
author VARCHAR (100) REFERENCES members (username),
posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`

  async function main() {
    console.log("seeding...");
    
    const client = new pg.Client({
      connectionString: 
      `postgresql://${USERNAME}:${PASSWORD}@localhost:5432/odin`,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
  }
  
  main();