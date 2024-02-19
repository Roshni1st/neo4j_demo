const neo4j = require("neo4j-driver");

const uri = "bolt://44.201.83.127:7687";
const user = "neo4j";
const password = "cuffs-access-debris";

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

module.exports = driver;
