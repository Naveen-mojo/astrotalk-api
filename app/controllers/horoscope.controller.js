const db = require('../models');
const { horoscope: Horoscope, horoscopecontent: HoroscopeContent, zodiac: Zodiac } = db;

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

exports.getHoroscope = async (req, res) => {

    console
    const zodiacSign = req.params.zodiac
    const horoType = req.params.type

    // const getHoroscopeId = await Horoscope.findOne({ 'horoSlug': horoType })
    // const getZodiacId = await Zodiac.findOne({ 'signSlug': zodiacSign })
    console.log(req.params)

    // const ZodiacID = getZodiacId.c_id
    // const HoroscopeID = getHoroscopeId.id
    try {
        const getcontent = await HoroscopeContent.findOne({ 'zodiacID': zodiacSign, 'horoscopeID': horoType })
        res.status(200).send(getcontent)
    } catch (error) {
        res.status(500).send({ message: error })
    }

}
exports.getCategory = async (req, res) => {

    try {
        const category = await Horoscope.find({});
        /*    var catData = category.map((row, i) => {
         var obj = {};
         obj[row.horoSlug] = row;
         return obj;
     })
     console.log("Category: ", catData) */
        res.status(200).send(category);
    } catch (err) {
        res.status(500).send({ message: err });
    }
}