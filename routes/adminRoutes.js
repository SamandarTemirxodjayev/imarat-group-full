const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Blog = require("../models/Blog");
const Category = require("../models/Category");
const Vacancy = require("../models/Vacancy");
const Project = require("../models/Project");
const Shorts = require("../models/Shorts");
const User = require("../models/User");
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
  return res.redirect("/");
};

router.post("/", (req, res) => {
  const { username, password } = req.body;
  if (authenticateUser(username, password)) {
    req.session.isAuthenticated = true;
    return res.redirect("/dashboard");
  } else {
    return res.render("login", {
      error: "Неправильное имя пользователя или пароль",
    });
  }
});

router.get("/", (req, res) => {
  return res.render("login", { error: null });
});

router.get("/logout", isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    return res.redirect("/");
  });
});

router.get("/dashboard", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/");
  }
  return res.render("adminDashboard");
});

// blogs route codes
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

router.get("/blogs/:blogId", isAuthenticated, async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.json(blog);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

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
      const { newTitle, newDescription, newHashtag } = req.body;
      if (!newTitle || !newDescription || !newHashtag) {
        return res.status(400).send("All inputs are required");
      }
      const newBlog = new Blog({
        title: newTitle,
        description: newDescription,
        hashtag: newHashtag,
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
      const { updatedTitle, updatedDescription, updatedHashtag } = req.body;
      const updatedPhoto = req.file ? req.file.path : "";
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).send("Blog not found");
      }
      blog.title = updatedTitle;
      blog.description = updatedDescription;
      blog.hashtag = updatedHashtag;
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

// categories route codes
router.get("/categories", isAuthenticated, async (req, res) => {
  try {
    const categories = await Category.find();
    return res.render("adminCategories", { categories });
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.get("/categories/:categoryId", isAuthenticated, async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.json(category);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/categories/create", isAuthenticated, async (req, res) => {
  try {
    const { newCategory } = req.body;
    if (!newCategory) {
      return res.status(400).send("Category is required");
    }
    const category = new Category({
      category: newCategory,
    });
    await category.save();
    return res.redirect("/categories");
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.post(
  "/categories/update/:categoryId",
  isAuthenticated,
  async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
      const { updatedCategory } = req.body;
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).send("Category not found");
      }
      category.category = updatedCategory;
      await category.save();
      return res.redirect("/categories");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

router.get(
  "/categories/delete/:categoryId",
  isAuthenticated,
  async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
      const deletedCategory = await Category.findByIdAndDelete(categoryId);
      if (!deletedCategory) {
        return res.status(404).send("Category not found");
      }
      return res.redirect("/categories");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

// Vacancies route codes
router.get("/vacancies", isAuthenticated, async (req, res) => {
  try {
    const vacancies = await Vacancy.find();
    const categories = await Category.find();
    res.render("adminVacancies", { vacancies, categories });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.get("/vacancies/:vacancyId", isAuthenticated, async (req, res) => {
  try {
    const vacancyId = req.params.vacancyId;
    const vacancy = await Vacancy.findById(vacancyId);
    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }
    return res.json(vacancy);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/vacancies/create", isAuthenticated, async (req, res) => {
  try {
    const { newCategory, newTitle, newDescription, newPrice } = req.body;
    if (!newCategory || !newTitle || !newDescription || !newPrice) {
      return res.status(400).send("All fields are required");
    }
    const newVacancy = new Vacancy({
      category: newCategory,
      title: newTitle,
      description: newDescription,
      price: newPrice,
    });
    await newVacancy.save();
    return res.redirect("/vacancies");
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post(
  "/vacancies/update/:vacancyId",
  isAuthenticated,
  async (req, res) => {
    try {
      const vacancyId = req.params.vacancyId;
      const {
        updatedCategory,
        updatedTitle,
        updatedDescription,
        updatedPrice,
      } = req.body;
      if (
        !updatedCategory ||
        !updatedTitle ||
        !updatedDescription ||
        !updatedPrice
      ) {
        return res.status(400).send("All fields are required");
      }
      const vacancy = await Vacancy.findById(vacancyId);
      if (!vacancy) {
        return res.status(404).send("Vacancy not found");
      }
      vacancy.category = updatedCategory;
      vacancy.title = updatedTitle;
      vacancy.description = updatedDescription;
      vacancy.price = updatedPrice;
      await vacancy.save();
      return res.redirect("/vacancies");
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

router.get(
  "/vacancies/delete/:vacancyId",
  isAuthenticated,
  async (req, res) => {
    try {
      const vacancyId = req.params.vacancyId;
      const deletedVacancy = await Vacancy.findByIdAndDelete(vacancyId);
      if (!deletedVacancy) {
        return res.status(404).send("Vacancy not found");
      }
      return res.redirect("/vacancies");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

// Projects route codes
router.get("/projects", isAuthenticated, async (req, res) => {
  try {
    const projects = await Project.find();
    return res.render("adminProjects", { projects });
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.get("/projects/:projectId", isAuthenticated, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.json(project);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/projects/create",
  upload.single("newPhoto"),
  isAuthenticated,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No file attached to the request");
      }
      const photoPath = req.file.path;
      const { newCategory } = req.body;
      if (!newCategory) {
        return res.status(400).send("All fields are required");
      }
      const newProject = new Project({
        category: newCategory,
        photo: photoPath,
      });
      await newProject.save();
      return res.redirect("/projects");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

router.post(
  "/projects/update/:projectId",
  upload.single("updatedPhoto"),
  isAuthenticated,
  async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const { updatedCategory } = req.body;
      const updatedPhoto = req.file ? req.file.path : "";
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).send("Project not found");
      }
      project.category = updatedCategory;
      if (updatedPhoto) {
        project.photo = updatedPhoto;
      }
      await project.save();
      return res.redirect("/projects");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

router.get("/projects/delete/:projectId", isAuthenticated, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const deletedProject = await Project.findByIdAndDelete(projectId);
    if (!deletedProject) {
      return res.status(404).send("Project not found");
    }
    return res.redirect("/projects");
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

// Shorts route codes
router.get("/shorts", isAuthenticated, async (req, res) => {
  try {
    const shorts = await Shorts.find();
    return res.render("adminShorts", { shorts });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/shorts/:shortId", isAuthenticated, async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const short = await Shorts.findById(shortId);
    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }
    return res.json(short);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/shorts/create", isAuthenticated, async (req, res) => {
  try {
    const { newUrl } = req.body;
    if (!newUrl) {
      return res.status(400).send("URL is required");
    }
    const newShort = new Shorts({
      url: newUrl,
    });
    await newShort.save();
    return res.redirect("/shorts");
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/shorts/update/:shortId", isAuthenticated, async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const { updatedUrl } = req.body;
    const short = await Shorts.findById(shortId);
    if (!short) {
      return res.status(404).send("Short URL not found");
    }
    short.url = updatedUrl;
    await short.save();
    return res.redirect("/shorts");
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/shorts/delete/:shortId", isAuthenticated, async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const deletedShort = await Shorts.findByIdAndDelete(shortId);
    if (!deletedShort) {
      return res.status(404).send("Short URL not found");
    }
    return res.redirect("/shorts");
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

// Users route codes
router.get("/users", isAuthenticated, async (req, res) => {
  try {
    const users = await User.find();
    return res.render("adminUsers", { users });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/users/:userId", isAuthenticated, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/users/create", isAuthenticated, async (req, res) => {
  try {
    const {
      newHouse,
      newHouseDesc,
      newFirstName,
      newLastName,
      newUsername,
      newPassword,
      newCameraOne,
      newCameraTwo,
      newCameraThree,
      newCameraFour,
    } = req.body;
    if (
      !newHouse ||
      !newHouseDesc ||
      !newFirstName ||
      !newLastName ||
      !newUsername ||
      !newPassword ||
      !newCameraOne ||
      !newCameraTwo ||
      !newCameraThree ||
      !newCameraFour
    ) {
      return res.status(400).send("User details are required");
    }
    const newUser = new User({
      house: newHouse,
      houseDesc: newHouseDesc,
      firstName: newFirstName,
      lastName: newLastName,
      username: newUsername,
      password: newPassword,
      cameraOne: newCameraOne,
      cameraTwo: newCameraTwo,
      cameraThree: newCameraThree,
      cameraFour: newCameraFour,
    });
    await newUser.save();
    return res.redirect("/users");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/users/update/:userId", isAuthenticated, async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      updatedHouse,
      updatedHouseDesc,
      updatedFirstName,
      updatedLastName,
      updatedUsername,
      updatedPassword,
      updatedCameraOne,
      updatedCameraTwo,
      updatedCameraThree,
      updatedCameraFour,
    } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.house = updatedHouse;
    user.houseDesc = updatedHouseDesc;
    user.firstName = updatedFirstName;
    user.lastName = updatedLastName;
    user.username = updatedUsername;
    user.password = updatedPassword;
    user.cameraOne = updatedCameraOne;
    user.cameraTwo = updatedCameraTwo;
    user.cameraThree = updatedCameraThree;
    user.cameraFour = updatedCameraFour;
    await user.save();
    return res.redirect("/users");
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/users/delete/:userId", isAuthenticated, async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    return res.redirect("/users");
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

router.use((req, res, next) => {
  if (!req.url.startsWith("/api")) {
    return res.status(404).render("404");
  }
  next();
});
module.exports = router;
