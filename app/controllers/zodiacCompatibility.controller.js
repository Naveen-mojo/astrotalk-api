const { zodiac, zodiacCompatibility } = require('../models');
const db = require('../models');
const { zodiacCompatibility: ZodiacCompatibility } = db;

exports.addZodiacCompatibility = async (req, res) => {
    // if (!req.body.partnerSign) {
    //     res.status(400).send({ message: 'please fill all required fields' })
    //     return;
    // }
    const newZodiacCompatibility = new ZodiacCompatibility({
        yourSign: req.body.yourSign,
        partnerSign: req.body.partnerSign,
        description: req.body.description,
        slug: req.body.slug
    })
    try {
        const savedZodiacCompatibility = await newZodiacCompatibility.save();
        console.log(savedZodiacCompatibility.params);
        res.status(201).send({ savedZodiacCompatibility })
    } catch (error) {
        res.status(500).send(error)
    }
}
exports.getZodiacPair = async (req, res) => {
    try {
        const pairData = await zodiacCompatibility.findOne({
            yourSign: req.params.selfId,
            partnerSign: req.params.partnerId
        });
        // console.log("pairData:", req.params)
        res.status(200).send(pairData);
    }
    catch (err) {
        res.status(500).send(err)
    }
}