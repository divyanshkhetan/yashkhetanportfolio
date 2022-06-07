import connectDB from "../../middleware/mongodb";
import User from "../../models/user";

const bcrypt = require("bcrypt");

const handler = async (req, res) => {
  if (req.method == "POST") {
    const { email, password } = req.body;
    if (email && password) {
      try {
        const user = await User.findOne({ email });
        if (user) {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            return res.status(200).json({
              name: user.name,
              email: user.email
            });
          } else {
            return res.send(null);
          }
        } else {
          console.log("User not found");
          return res.send(null);
        }
      } catch (error) {
        return res.status(500).send(null);
      }
    } else {
      res.status(422).send("data_incomplete");
    }
  } else {
    res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);