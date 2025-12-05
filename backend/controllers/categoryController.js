import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

//get All Categories -- api/v1/categories
export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ name: 1 });

    if (categories.length === 0) {
        return res.status(404).json({ message: "No categories found" });
    }
    res.json(categories);
});

//get single category -- api/v1/categories/:id
export const getSingleCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Try to find by ID or slug
    const category = await Category.findOne({
        $or: [{ _id: id }, { slug: id }]
    });

    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
});

//create a new category - api/v1/categories
export const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Category name is required" });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
        name,
        description: description || "",
    });

    if (!category) {
        return res.status(400).json({ message: "Failed to create category" });
    }

    res.status(201).json({ message: "Category created successfully", category });
});

//delete category - api/v1/categories/:id
export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully", category });
});

//update category - api/v1/categories/:id
export const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Category name is required" });
    }

    // Check if another category has this name
    const existingCategory = await Category.findOne({
        name,
        _id: { $ne: id }
    });
    if (existingCategory) {
        return res.status(400).json({ message: "Category name already exists" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        id,
        {
            name,
            description,
        },
        { new: true }
    );

    if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
});
