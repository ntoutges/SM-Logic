const mains = require("./lib/main.js");
const GenericBody = require("./lib/containers/genericBody.js").GenericBody;
const fs = require("fs");

const BLUEPRINT_VERSION = 4;
// const outputPath = __dirname + "/_output";
const outputPath = "C:/Users/Nicholas/AppData/Roaming/Axolot Games/Scrap Mechanic/User/User_76561198278723162/Blueprints/\c27c92ef-0265-417b-81c0-572210c529b3";
// windows path = C:\Users\Nicholas\AppData\Roaming\Axolot Games\Scrap Mechanic\User\User_76561198278723162\Blueprints\\c27c92ef-0265-417b-81c0-572210c529b3

if (!("Body" in mains))
  throw new Error("main.js must export class [Body]");

const body = new mains.Body();

if (!(body instanceof GenericBody))
  throw new Error("class [Body] does not extend class [GenericBody]");

const startTime = new Date();

let midTime;

console.log("Creating JSON.");
body.build().then(blueprintObjects => {
  const blueprintString = `{\"bodies\":[{\"childs\":[${blueprintObjects.build()}]}],\"version\":${BLUEPRINT_VERSION}}`;

  midTime = new Date();
  const delta1 = midTime.getTime() - startTime.getTime();
  if (delta1 > 100) {
    console.log(`--- Took ${delta1}ms --- `);
  }

  const descriptionString = body.description;

  const bytes = blueprintString.length * 8;
  console.log(`Writing to file(${bytes} bytes).`)

  fs.writeFile(outputPath + "/blueprint.json", blueprintString, "utf-8", checkIfDone);
  // fs.writeFile(outputPath + "/description.json", descriptionString, "utf-8", checkIfDone);
});
var outputCount = 0;

function checkIfDone() {
  outputCount++;
  if (outputCount < 1)
    return;
  console.log("Done.");

  const endTime = new Date();
  const delta2 = endTime.getTime() - midTime.getTime();
  if (delta2 > 100)
    console.log(`--- Took ${delta2}ms ---`);
}
