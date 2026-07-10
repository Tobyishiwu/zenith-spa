console.log("ENV KEYS:", Object.keys(import.meta.env).sort());

for (const [key, value] of Object.entries(import.meta.env)) {
  console.log(`${key} = ${value}`);
}