const db = require('../models');
const { zodiacCompatibility: ZodiacCompatibility } = db;

exports.addZodiacCompatibility = async (req, res) => {
    // if (!req.body.partnerSign) {
    //     res.status(400).send({ message: 'please fill all required fields' })
    //     return;
    // }
    const newZodiacCompatibility = new ZodiacCompatibility(req.body)
    try {
        const savedZodiacCompatibility = await newZodiacCompatibility.save();
        res.status(201).send({ savedZodiacCompatibility })
    } catch (error) {
        res.status(500).send(err)
    }
}