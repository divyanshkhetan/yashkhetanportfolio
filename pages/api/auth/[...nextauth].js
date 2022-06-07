import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter the password",
        },
      },
      async authorize(credentials, req) {
        console.log("authorize", credentials);
        const email = credentials.email;
        const password = credentials.password;
        let user;
        try {
          const res = await axios.post("http://localhost:3000/api/login", {
            email,
            password,
          });
          // console.log("response: ", res);
          console.log("Response aaya hai bhaiya");
          console.log("Res data: ", res.data);
          user = res.data;
        } catch (error) {
          console.log("error", error);
        }
        // If no error and we have user data, return it
        if (user) {
        //   console.log(user);
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  session: {
    // Set to jwt in order to CredentialsProvider works properly
    strategy: "jwt",
    maxAge: 24 * 60 * 60,    // 1 day
  },
  jwt: {
    // Set to jwt in order to CredentialsProvider works properly
    secret: process.env.NEXTAUTH_SECRET,
    expiresIn: "1d",
  }
});