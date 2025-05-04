const User = require("../models/User");

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.changeRole = async (req, res) => {
  const { role } = req.body;
  await User.findByIdAndUpdate(req.params.id, { role, vendorRequest: false });
  res.send("Role updated");
};

exports.getVendorRequests = async (req, res) => {
  const requests = await User.find({ vendorRequest: true });
  res.json(requests);
};
