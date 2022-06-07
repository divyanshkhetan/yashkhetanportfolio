import connectDB from "../../middleware/mongodb";
import User from "../../models/user";

const bcrypt = require("bcrypt");

const handler = async (req, res) => {
  if (req.method == "POST") {
    const { email, oldPassword, newPassword } = req.body;
    if (email && oldPassword && newPassword) {
      try {
        const user = await User.findOne({ email });
        if (user) {
          const passwordMatch = await bcrypt.compare(oldPassword, user.password);
          if (passwordMatch) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
            return res.status(200).json({
              name: user.name,
              email: user.email,
              success: true,
            });
          } else {
            return res.send("Wrong Password!");
          }
        } else {
          console.log("User not found");
          return res.send(null);
        }
      } catch (error) {
        return res.status(500).send("Internal Error");
      }
    } else {
      res.status(422).send("data_incomplete");
    }
  } else {
    res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);
