const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Blog = require("../models/Blog");
const uuid = require("uuid");

const authenticateUser = (username, password) => {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  return username === adminUsername && password === adminPassword;
};

const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  }
  return res.redirect("/login");
};

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (authenticateUser(username, password)) {
    req.session.isAuthenticated = true;
    return res.redirect("/dashboard");
  } else {
    return res.render("login", { error: "Invalid username or password" });
  }
});

router.get("/login", (req, res) => {
  return res.render("login", { error: null });
});

router.get("/logout", isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    return res.redirect("/login");
  });
});

router.get("/dashboard", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/login");
  }
  return res.render("adminDashboard");
});

router.get("/blogs", isAuthenticated, async (req, res) => {
  try {
    const blogs = await Blog.find();
    return res.render("adminBlogs", { blogs });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuid.v4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/blogs/create",
  upload.single("newPhoto"),
  isAuthenticated,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No file attached to the request");
      }
      const photoPath = req.file.path;
      const { newTitle, newDescription } = req.body;
      if (!newTitle || !newDescription) {
        return res.status(400).send("Title and description are required");
      }
      const newBlog = new Blog({
        title: newTitle,
        description: newDescription,
        photo: photoPath,
      });
      await newBlog.save();
      return res.redirect("/blogs");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

router.post(
  "/blogs/update/:blogId",
  isAuthenticated,
  upload.single("updatedPhoto"),
  async (req, res) => {
    try {
      const blogId = req.params.blogId;
      const { updatedTitle, updatedDescription } = req.body;
      const updatedPhoto = req.file ? req.file.path : "";
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).send("Blog not found");
      }
      blog.title = updatedTitle;
      blog.description = updatedDescription;
      if (updatedPhoto) {
        blog.photo = updatedPhoto;
      }
      await blog.save();
      return res.redirect("/blogs");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

router.get("/blogs/delete/:blogId", isAuthenticated, async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.status(404).send("Blog not found");
    }
    return res.redirect("/blogs");
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
});
module.exports = router;