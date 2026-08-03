import { loadWins } from "./github-issues.js";

function main(): void {
  console.log(JSON.stringify(loadWins(), null, 2));
}

main();
