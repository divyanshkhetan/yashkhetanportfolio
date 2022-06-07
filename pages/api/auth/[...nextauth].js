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
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const { email, password } = credentials;
        // console.log(email, password);
        let user;
        try {
          const res = await axios.post("http://localhost:3000/api/login", {
            email,
            password,
          });
        //   console.log("response:", res);
        //   console.log("Res data: ", res.data);
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
  callbacks: {
    async jwt({ token, user }) {
      // Since you are using Credentials' provider, the data you're persisting
      // _should_ reside in the user here (as far as can I see, since I've just tested it out).
      // This gets called whenever a JSON Web Token is created (once) or updated
      // console.log("token", token);
      // console.log("user", user);
      if (user) {
        // token.rollno = user.rollno;
        // token.userType = user.userType;
      }
      return token;
    },

    async session({ session, token }) {
      // This gets called whenever a session is created (once) or updated
    //   session.user.rollno = token.rollno;
    //   session.user.userType = token.userType;
      return session;
    },
  },
});