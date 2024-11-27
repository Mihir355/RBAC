const express = require("express");
const User = require("../models/userModel");
const Subscription = require("../models/subscriptionModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

router.get("/fetch-users", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users with their roles
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users." });
  }
});

router.put("/modify-role", async (req, res) => {
  const { userId, newRole } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.usertype = newRole; // Update the user's role
    await user.save();
    res.json({ message: "Role updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error updating role." });
  }
});

router.get("/fetch-subscriptions", async (req, res) => {
  try {
    // Fetch all subscriptions with status 'requested'
    const subscriptions = await Subscription.find({ status: "requested" });

    if (subscriptions.length === 0) {
      return res
        .status(404)
        .json({ message: "No requested subscriptions found." });
    }

    // Return the fetched subscriptions
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching subscriptions", error });
  }
});

router.post("/approve-subscription", async (req, res) => {
  const { subscriptionId, action } = req.body;

  try {
    // Find the subscription by ID
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found." });
    }

    // Handle approval or rejection
    if (action === "approve") {
      // Update the user's role in the User collection based on the requested subscription type
      const user = await User.findOne({
        name: subscription.createdBy,
        usertype: subscription.currentRole,
      });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Update user's userType to the requested subscription type
      user.usertype = subscription.subscriptionType;
      await user.save();

      // Change the subscription status to 'approved'
      subscription.status = "approved";
      await subscription.save();

      return res
        .status(200)
        .json({ message: "Subscription approved successfully." });
    } else if (action === "reject") {
      // Change the subscription status to 'rejected'
      subscription.status = "rejected";
      await subscription.save();

      return res.status(200).json({ message: "Subscription rejected." });
    } else {
      return res.status(400).json({ message: "Invalid action." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error processing subscription approval/rejection." });
  }
});

router.post("/request-subscription", async (req, res) => {
  const { email, subscriptionType, reason, userType, currentRole } = req.body;

  try {
    // Find the user by email and userType
    const user = await User.findOne({ email, usertype: userType });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found or userType mismatch" });
    }

    // Create the subscription request with currentRole included
    const newSubscription = new Subscription({
      createdBy: user.name, // User's name
      currentRole, // Save the current role
      subscriptionType, // Subscription type (role)
      reason, // Reason for the subscription request
      status: "requested", // Status is set to 'requested' by default
    });

    // Save the subscription to the database
    await newSubscription.save();

    // Return a success response
    res
      .status(200)
      .json({ message: "Subscription request submitted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error submitting subscription request", error });
  }
});

router.post("/signup", async (req, res) => {
  const { name, email, password, usertype } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const newUser = new User({
    name,
    email,
    password,
    usertype,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering the user", error });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password, usertype } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (usertype && user.usertype !== usertype) {
      return res.status(400).json({ message: "User type mismatch" });
    }

    const token = jwt.sign(
      { id: user._id, usertype: user.usertype },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User logged in successfully",
      userType: user.usertype,
      token: token,
      userEmail: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in the user", error });
  }
});

module.exports = router;
