import Art from "../models/Art.js";
import cloudinary from "../utils/cloudinary.js";

export const addArt = async (req, res) => {
  try {
    const { title, description, price, categories } = req.body;

    const imageUrls = req.files.map(file => file.path);

    // Process categories - convert to array and clean up
    let processedCategories = [];
    if (categories) {
      processedCategories = Array.isArray(categories) 
        ? categories.map(cat => cat.trim().toLowerCase())
        : categories.split(',').map(cat => cat.trim().toLowerCase());
    }

    const art = new Art({
      title,
      description,
      price,
      categories: processedCategories,
      images: imageUrls,
      createdBy: req.user.id,
    });

    await art.save();
    res.status(201).json({ message: "Art added successfully", art });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Arts with category filtering
export const getArts = async (req, res) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;
    
    // Build filter object
    let filter = {};
    
    if (category && category !== 'all') {
      filter.categories = category.toLowerCase();
    }

    // Get all distinct categories for filtering
    const allCategories = await Art.distinct("categories");

    // Execute query with pagination
    const arts = await Art.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count for pagination
    const total = await Art.countDocuments(filter);

    res.json({
      arts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      allCategories
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all available categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Art.distinct("categories");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getArtById = async (req, res) => {
  try {
    const art = await Art.findById(req.params.id).populate("createdBy", "name email");

    if (!art) {
      return res.status(404).json({ message: "Art not found" });
    }

    res.status(200).json(art);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get logged-in user's own arts
export const getMyArts = async (req, res) => {
  try {
    const myArts = await Art.find({ createdBy: req.user.id }).populate("createdBy", "name email");
    res.json(myArts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateArt = async (req, res) => {
  try {
    const { id } = req.params;
    const art = await Art.findById(id);

    if (!art) return res.status(404).json({ message: "Art not found" });
    if (art.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        cloudinary.uploader.upload(file.path, { folder: "arthive" })
      );
      const uploadResults = await Promise.all(uploadPromises);
      art.images = uploadResults.map(result => result.secure_url);
    }

    art.title = req.body.title || art.title;
    art.description = req.body.description || art.description;
    art.price = req.body.price || art.price;

    if (req.body.categories) {
      art.categories = Array.isArray(req.body.categories) 
        ? req.body.categories.map(cat => cat.trim().toLowerCase())
        : req.body.categories.split(',').map(cat => cat.trim().toLowerCase());
    }

    await art.save();
    res.json({ message: "Art updated", art });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteArt = async (req, res) => {
  try {
    const { id } = req.params;
    const art = await Art.findById(id);

    if (!art) return res.status(404).json({ message: "Art not found" });
    if (art.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await art.deleteOne();
    res.json({ message: "Art deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};