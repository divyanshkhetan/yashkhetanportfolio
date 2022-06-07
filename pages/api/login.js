import connectDB from "../../middleware/mongodb";
import User from "../../models/user";

const bcrypt = require("bcrypt");

const handler = async (req, res) => {
  console.log("Login Executed");
  if (req.method == "POST") {
    console.log("Login Post Executed");
    const { email, password } = req.body;
    if (email && password) {
      console.log(email, password);
      try {
        const user = await User.findOne({ email });
        if (user) {
          console.log("User Found");
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            console.log("Password Match");
            const responseData = {
              name: user.name,
              email: user.email,
            }
            return res.status(200).json(responseData);
          } else {
            console.log("Wrong Password!");
            return res.send(null);
          }
        } else {
          console.log("User not found");
          return res.send(null);
        }
      } catch (error) {
        console.log("error", error);
        return res.status(500).send(null);
      }
    } else {
      console.log("data_incomplete");
      res.status(422).send("data_incomplete");
    }
  } else {
    console.log("req_method_not_supported");
    res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);