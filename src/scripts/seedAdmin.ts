import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";

async function seedAdmin() {
  try {
    const adminData = {
      name: "admin3 Saheb",
      email: "admin3@gmail.com",
      role: UserRole.ADMIN,
      password: "admin1234",
    };
    // check user exist on db or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (existingUser) {
      throw new Error("User already exists");
    }
    const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email",{
        method:"POST",
        headers:{
            "content-Type":"application/json"
        },
        body: JSON.stringify(adminData)
    })

   if(signUpAdmin.ok){
    await prisma.user.update({
        where:{
            email:adminData.email
        },
        data:{
            emailVerified: true
        }
    })
   }
  } catch (error) {
    console.log(error);
  }
}

seedAdmin()
