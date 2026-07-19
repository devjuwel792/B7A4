import { app } from "./app";
import { prisma } from "./lib/prisma";
import 'dotenv/config'

const PORT = process.env.PORT || 5000
async function  main() {
    try {
        // await prisma.$connect();
        console.log("Database connected successfully")
        app.listen(PORT, () => {
            console.log(`Example app listening on PORT :  ${PORT}`);
        });
    } catch (error) {
        console.error(`Error starting the server : ${error}`);
        // prisma.$disconnect();
        process.exit(1);

    }

}

main();