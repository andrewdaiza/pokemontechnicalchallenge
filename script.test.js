const fetchPokemonData = require("./scripttest.js");

test("Properly calculates the average height of Pokemon", async () => {
  const data = await fetchPokemonData(5, 0);
  expect(data).toBe(10.8);
});
