import app from "./app";
import { prisma } from "./lib/prisma";

const port = process.env.PORT || 5000;
async function main() {
  try {
    await prisma.$connect();
    console.log("connection to the database successfully");
    app.listen(port, () => {
      console.log(`server is running on ${port}`);
    });
  } catch (error) {
    console.log("an error occured", error);
    process.exit(1);
  }
}

main();
