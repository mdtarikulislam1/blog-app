import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
// import { sendEmail } from "./email";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification:true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

        const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background: #ffffff;
      margin: auto;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #888888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Verify Your Email</h1>

    <p>Hi <strong>${user?.name || "there"}</strong>,</p>

    <p>
      Thank you for creating an account on <strong>Prisma Blog</strong>.
      Please verify your email address by clicking the button below.
    </p>

    <a href="${verificationUrl}" class="btn">Verify Email</a>

    <p>
      If the button doesn’t work, copy and paste this link into your browser:
    </p>

    <p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    </p>

    <p>
      This link will expire soon for security reasons.
    </p>

    <div class="footer">
      <p>
        If you did not create this account, you can safely ignore this email.
      </p>
      <p>© ${new Date().getFullYear()} Prisma Blog</p>
    </div>
  </div>
</body>
</html>
`;

        console.log(user, url, token);
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismablog@ethereal.email>',
          to: user.email, // dynamic
          subject: "Verify your email address",
          html: htmlTemplate,
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  socialProviders: {
    google: {
      prompt:'select_account consent',
      accessType:"offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
