const express = require("express");
const router = express.Router();
const Blog = require("../models/blogModel");
const User = require("../models/userModel"); // Assuming you have a User model

router.put("/edit-blog", async (req, res) => {
  try {
    const { blogId, title, description, managerName } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    blog.title = title;
    blog.description = description;
    blog.modifiedBy = managerName; // Manager editing the blog
    blog.status = "published";
    blog.modifiedAt = new Date();

    await blog.save();
    res
      .status(200)
      .json({ message: "Blog updated and published successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error editing blog." });
  }
});

router.get("/fetch-sample-blogs", async (req, res) => {
  try {
    const sampleBlogs = await Blog.find({ status: "sample" }); // Adjust according to your schema
    res.json(sampleBlogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sample blogs." });
  }
});

router.get("/fetch-all-blogs", async (req, res) => {
  try {
    const allBlogs = await Blog.find(); // This fetches all blogs
    res.json(allBlogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs." });
  }
});

router.post("/approve-blog", async (req, res) => {
  try {
    const { blogId, managerName } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    blog.status = "published";
    blog.modifiedBy = managerName; // Manager approving the blog
    blog.modifiedAt = new Date();

    await blog.save();
    res
      .status(200)
      .json({ message: "Blog approved and published successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error approving blog." });
  }
});

router.get("/fetch-unpublished-blogs", async (req, res) => {
  try {
    const unpublishedBlogs = await Blog.find({ status: "draft" }).sort({
      createdAt: -1,
    });
    res.status(200).json(unpublishedBlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching unpublished blogs." });
  }
});

router.get("/fetch-published-blogs", async (req, res) => {
  try {
    const publishedBlogs = await Blog.find({ status: "published" }).sort({
      createdAt: -1,
    });
    res.status(200).json(publishedBlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching published blogs." });
  }
});

// Route to create a new blog
router.post("/create", async (req, res) => {
  try {
    const { title, description, status, email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Prepare blog data
    const newBlog = new Blog({
      title,
      description,
      createdBy: user.name, // Use the user's name
      modifiedBy: user.name, // Initially the same as createdBy
      status,
    });

    await newBlog.save();
    res
      .status(201)
      .json({ message: "Blog created successfully.", blog: newBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating blog." });
  }
});

module.exports = router;
