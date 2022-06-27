const fetch = require("node-fetch");

const tick = Date.now();
const log = (v) => console.log(`${v} Time: ${Date.now() - tick}ms`);

const args = process.argv;

const fetchPokemonData = async (args) => {
  const limit = args[2];
  const offset = args[3];
  let totalWeight = 0;
  let totalHeight = 0;
  let weightByType = {};
  let heightByType = {};
  const req = await fetch(
    `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`
  );
  const res = await req.json();
  const pokemon = res.results;

  await Promise.all(
    pokemon.map(async (poke) => {
      const res = await fetch(poke.url);
      const result = await res.json();
      const { weight, height, types } = result;
      totalWeight += weight;
      totalHeight += height;

      types.forEach((types) => {
        const { type } = types;
        if (weightByType[type.name] || heightByType[type.name]) {
          weightByType[type.name].typeWeight += weight;
          heightByType[type.name].typeHeight += height;
          weightByType[type.name].count += 1;
          heightByType[type.name].count += 1;
        } else {
          weightByType[type.name] = { typeWeight: weight, count: 1 };
          heightByType[type.name] = { typeHeight: height, count: 1 };
        }
      });
      return result;
    })
  );

  totalWeight = totalWeight / limit;
  totalHeight = totalHeight / limit;

  console.log(`Total Average Weight: ${totalWeight}`);
  console.log(`Total Average Height: ${totalHeight}`);

  console.log("Average Pokemon Weight by Type:");
  for (const property in weightByType) {
    const averageTypeWeight = (
      weightByType[property].typeWeight / weightByType[property].count
    ).toFixed(2);
    console.log(`${property}: ${averageTypeWeight}`);
  }
  console.log("Average Pokemon Height by Type:");
  for (const property in heightByType) {
    const averageTypeHeight = (
      heightByType[property].typeHeight / heightByType[property].count
    ).toFixed(2);
    console.log(`${property}: ${averageTypeHeight}`);
  }
  log("End");
  return Number(totalHeight);
};
fetchPokemonData(args);

module.exports = fetchPokemonData;
