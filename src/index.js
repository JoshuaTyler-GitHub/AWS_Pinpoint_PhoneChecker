import Orchestration from "./src/orchestration/Orchestration.js";

// Initialize with ctrl+c as exit
Orchestration.initialize();
process.on('SIGINT', () => {
  Orchestration.onExit()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(0);
  });
});
