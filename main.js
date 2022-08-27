const mains = require("./lib/main.js");
const GenericBody = require("./lib/containers/classes.js").GenericBody;
const fs = require("fs");

const BLUEPRINT_VERSION = 4;
// const outputPath = __dirname + "/_output";
const outputPath = "C:/Users/Nicholas/AppData/Roaming/Axolot Games/Scrap Mechanic/User/User_76561198278723162/Blueprints/049a3c64-a5b6-43db-92ee-d9d9987676cf";

if (!("Body" in mains))
  throw new Error("main.js must export class [Body]");

const body = new mains.Body();

if (!(body instanceof GenericBody))
  throw new Error("class [Body] does not extend class [GenericBody]");

console.log("Creating JSON.");
const blueprintObjects = body.build();
const blueprintString = `{\"bodies\":[{\"childs\":[${blueprintObjects.build()}]}],\"version\":${BLUEPRINT_VERSION}}`;

const descriptionString = body.description;

const bytes = blueprintString.length;
console.log(`Writing to file(${bytes} bytes).`)

var outputCount = 0;
fs.writeFile(outputPath + "/blueprint.json", blueprintString, "utf-8", checkIfDone);
// fs.writeFile(outputPath + "/description.json", descriptionString, "utf-8", checkIfDone);

function checkIfDone() {
  outputCount++;
  if (outputCount < 2)
    return;
  console.log("Done.");
}
