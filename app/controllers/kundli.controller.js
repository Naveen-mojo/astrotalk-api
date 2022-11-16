const db = require('../models');
const { kundli: Kundli } = db;

exports.addKundli = async (req, res) => {
    if (!req.body.name) {
        res.status(400).send({ message: 'please fill all required fields' })
        return;
    }
    const newKundli = new Kundli(req.body)
    try {
        const savedKundli = await newKundli.save();
        res.status(201).send({ savedKundli })
    } catch (error) {
        res.status(500).send(err)
    }
}