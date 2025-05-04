const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { role } = req.body;
   
    const user = await User.findByIdAndUpdate(req.params.id, { role, vendorRequest: false });
    res.send("Role updated");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getVendorRequests = async (req, res) => {
  try {
  
    const requests = await User.find({ vendorRequest: true });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.requestVendor = async (req, res) => {
  try {
    
    const user = await User.findById(req.user.id); 
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.vendorRequest) {
      return res.status(400).json({ message: "Already requested to become a vendor" });
    }

    user.vendorRequest = true;
    await user.save();

    res.json({ message: "Vendor request submitted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
