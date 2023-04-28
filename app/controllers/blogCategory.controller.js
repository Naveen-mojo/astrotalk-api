const db = require('../models');
const { blogcategory: BlogCategory } = db;

exports.addBlogCategory = async (req, res) => {
    try {
        if (!req.body.category || !req.body.slug) {
            res.status(400).send({ message: "Please Fill Required Fields." })
            return;
        }

        const data = new BlogCategory({
            category: req.body.category,
            slug: req.body.slug,
            status: req.body.status,
        })

        const saveData = await data.save()
        res.status(201).send({ message: "Data Saved Successfully!" })
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.getBlogCategory = async (req, res) => {
    try {
        const blogCategory = await BlogCategory.find({ status: true }).sort({ 'category': 1 });
        res.status(200).json(blogCategory);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.getBlogCategoryById = async (req, res) => {
    try {
        const _id = req.params.id
        const data = await BlogCategory.findOne({ _id: _id });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.UpdateBlogCategory = async (req, res) => {
    try {
        const _id = req.params.id;
        if (!req.body) {
            res.status(400).send({ message: "No changes to update." });
            return;
        }

        const blogCategory = await BlogCategory.updateOne({ _id }, {
            $set: {
                category: req.body.category,
                slug: req.body.slug,
                status: req.body.status,
            }
        }, {
            new: true
        })

        if (!blogCategory) {
            res
                .status(400)
                .send({
                    message: `Cannot update Data with id=${_id}. Maybe Data was not found!`,
                });
        }
        res.status(200).send({ message: "Data Updated Successfully!", data: blogCategory });
    } catch (error) {
        res.status(500).json(error);
    }
}