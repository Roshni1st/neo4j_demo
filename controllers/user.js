const driver = require("../models/connection");
/*
Returning all data
*/
exports.all = async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run("MATCH (n) RETURN n");
    const nodes = result.records.map((record) => record.get("n").properties);
    res.json(nodes);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    await session.close();
  }
};

/*
nodes creations
*/
exports.create = async (req, res) => {
  const { label, name, age, city } = req.body;
  const session = driver.session();

  try {
    const result = await session.run(
      `CREATE (n:${label} {name: $name, age: $age, city: $city}) RETURN n`,
      {
        name,
        age,
        city,
      }
    );
    const createdNode = result.records[0].get("n").properties;
    res.json(createdNode);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    await session.close();
  }
};

/*
update nodes
*/
exports.update = async (req, res) => {
  const { id } = req.params;
  const { label, ...updatedProperties } = req.body;
  const session = driver.session();

  try {
    let setClauses = Object.keys(updatedProperties).map(
      (key) => `n.${key} = $${key}`
    );
    setClauses = setClauses.join(", ");

    const result = await session.run(
      `
        MATCH (n:${label})
        WHERE id(n) = $id
        SET ${setClauses}
        RETURN n
        `,
      { id: parseInt(id), ...updatedProperties }
    );

    const updatedNode = result.records[0].get("n").properties;
    res.json(updatedNode);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    await session.close();
  }
};

/* remove nodes
 */
exports.remove = async (req, res) => {
  const { id } = req.params;
  const session = driver.session();

  try {
    const result = await session.run(
      "MATCH (n) WHERE id(n) = $id DETACH DELETE n",
      { id: parseInt(id) }
    );

    if (result.summary.counters.nodesDeleted === 0) {
      res.status(404).send("Node not found");
      return;
    }

    res.status(204).send("Node deleted");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  } finally {
    await session.close();
  }
};
