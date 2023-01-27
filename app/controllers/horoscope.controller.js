const db = require('../models');
const { horoscope: Horoscope } = db;

exports.addHoroscope = async (req, res) => {
    if (!req.body.horoscope) {
        res.status(400).send({ message: 'please fill all required fields' })
        return;
    }
    const newHoroscope = new Horoscope(req.body)
    try {
        const savedHoroscope = await newHoroscope.save();
        res.status(201).send({ savedHoroscope })
    } catch (error) {
        res.status(500).send(err)
    }
}