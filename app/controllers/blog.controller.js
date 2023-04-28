const db = require('../models');
const { blog: Blog, blogcategory: BlogCategory } = db;

exports.addBlog = async (req, res) => {
    try {
        if (!req.body.title || !req.body.description || !req.body.slug) {
            res.status(400).send({ message: "Please Fill Required Fields." })
            return;
        }

        const data = new Blog({
            title: req.body.title,
            description: req.body.description,
            slug: req.body.slug,
            status: req.body.status,
            category: req.body.category,
            author: req.body.author,
            images: req.file ? `http://localhost:8080/upload/blog/${req.file.filename}` : ""
        })

        const saveData = await data.save()
        res.status(201).send({ message: "Data Saved Successfully!" })
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.getBlog = async (req, res) => {
    try {
        const _id = req.query.id
        if (_id) {
            try {
                const blog = await Blog.find({ category: _id }).sort({ '_id': -1 });
                res.status(200).json(blog);
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            const blog = await Blog.find({}).sort({ '_id': -1 });
            res.status(200).json(blog);
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

// Get Blog By Pagination
exports.findBlogPagination = (req, res) => {
    const getPagination = (page, size) => {
        const limit = size ? +size : 3;
        const offset = page ? page * limit : 0;
        return { limit, offset };
    };

    const getPagingData = (data, page, limit, count) => {
        const total = count;
        const currentPage = page ? +page : 0;
        const total_pages = Math.ceil(total / limit);
        return { data, pagination: { total, total_pages, currentPage } };
    };

    const { page, size, slug } = req.query;
    const { limit, offset } = getPagination(page, size);
    BlogCategory.findOne({ slug: slug }).exec(function (err, cate) {
        if (cate) {
            Blog.find({ status: true, category: cate._id }).countDocuments().exec(function (err, count) {
                Blog.find({ status: true, category: cate._id }).limit(limit).skip(offset)
                    .then((data) => {
                        const response = getPagingData(data, page, limit, count);
                        if (response.pagination.currentPage < response.pagination.total_pages) {
                            res.send(response);
                        } else {
                            res.send({ "results": response.results, "pagination": response.pagination = { err: `queried page ${response.pagination.currentPage} is >= to maximum page number ${response.pagination.total_pages}` } });
                        }
                    })
                    .catch((err) => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while retrieving post.",
                        });
                    });
            });
        } else {
            Blog.find({ status: true }).countDocuments().exec(function (err, count) {
                Blog.find({ status: true }).limit(limit).skip(offset)
                    .then((data) => {
                        const response = getPagingData(data, page, limit, count);
                        if (response.pagination.currentPage < response.pagination.total_pages) {
                            res.send(response);
                        } else {
                            res.send({ "results": response.results, "pagination": response.pagination = { err: `queried page ${response.pagination.currentPage} is >= to maximum page number ${response.pagination.total_pages}` } });
                        }
                    })
                    .catch((err) => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while retrieving post.",
                        });
                    });
            });
        }
    });
};

exports.getBlogBySlug = async (req, res) => {
    try {
        const slug = req.params.slug
        const data = await Blog.findOne({ slug: slug });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.UpdateBlog = async (req, res) => {
    try {
        const _id = req.params.id;
        if (!req.body) {
            res.status(400).send({ message: "No changes to update." });
            return;
        }

        const blog = await Blog.updateOne({ _id }, {
            $set: {
                title: req.body.title,
                description: req.body.description,
                slug: req.body.slug,
                status: req.body.status,
                category: req.body.category,
                author: req.body.author,
                images: req.file ? `http://localhost:8080/upload/blog/${req.file.filename}` : req.body.images
            }
        }, {
            new: true
        })

        if (!blog) {
            res
                .status(400)
                .send({
                    message: `Cannot update Data with id=${_id}. Maybe Data was not found!`,
                });
        }
        res.status(200).send({ message: "Data Updated Successfully!", data: blog });
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

exports.getBlogById = async (req, res) => {
    try {
        const _id = req.params.id
        const data = await Blog.findOne({ _id: _id });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.getBlogSearch = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" }, status: true } : { status: true };

    Blog.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Astro."
            });
        });
};