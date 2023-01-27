const db = require('../models');
const { horoscopecontent: HoroscopeContent } = db;

exports.addHoroscopeContent = async (req, res) => {
    if (!req.body.horoscopeID) {
        res.status(400).send({ message: 'please fill all required fields' })
        return;
    }
    const newHoroscopeContent = new HoroscopeContent(req.body)
    try {
        const savedHoroscopeContent = await newHoroscopeContent.save();
        res.status(201).send({ savedHoroscopeContent })
    } catch (error) {
        res.status(500).send(err)
    }
}