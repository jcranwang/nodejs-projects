const jwt = require("jsonwebtoken");
const Users = require("../models/users");

const auth = async (req, res, next) => {
  try {
    const authToken = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(authToken, "nodeisawesome");
    const user = await Users.findOne({
      _id: decoded._id,
      "tokens.token": authToken
    });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = authToken;
    next();
  } catch (e) {
    res.status(401).send("Error: No authorization");
  }
};

module.exports = auth;