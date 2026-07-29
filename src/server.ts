import { app } from "./app.js";
import config from "./config/index.js";
import { prisma } from "./lib/prisma.js";

const PORT = config.port;

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server listening on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error(`Error starting the server: ${error}`);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
