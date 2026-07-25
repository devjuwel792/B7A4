
import { app } from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";


const PORT = config.prot
async function  main() {
    try {
         await prisma.$connect();
        console.log("Database connected successfully")
        app.listen(PORT, () => {
            console.log(`Example app listening on PORT :  ${PORT}`);
        });
    } catch (error) {
        console.error(`Error starting the server : ${error}`);
        prisma.$disconnect();
        process.exit(1);

    }

}

main();