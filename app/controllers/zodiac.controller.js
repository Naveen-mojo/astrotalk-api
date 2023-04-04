const db = require('../models');
const { zodiac: Zodiac } = db;

exports.addZodiac = async (req, res) => {
    if (!req.body.zodiacSign) {
        res.status(400).send({ message: 'please fill all required fields' })
        return;
    }
    const newZodiac = new Zodiac(req.body)
    try {
        const savedZodiac = await newZodiac.save();
        res.status(201).send({ savedZodiac })
    } catch (error) {
        res.status(500).send(err)
    }
}

exports.getZodiac = async (req, res) => {
    try {
        const zodiac = await Zodiac.find({});
        res.status(200).json(zodiac);
    } catch (err) {
        res.status(500).json(err);
    }
};