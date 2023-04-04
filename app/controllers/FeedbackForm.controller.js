const db = require('../models');
const { feedbackform: FeedbackForm } = db;

exports.addFeedbackForm = async (req, res) => {
    if (!req.body.userId) {
        res.status(400).send({ message: 'please fill all required fields' })
        return;
    }
    const newFeedbackForm = new FeedbackForm(req.body)
    try {
        const savedFeedbackForm = await newFeedbackForm.save();
        res.status(201).send({ savedFeedbackForm })
    } catch (error) {
        res.status(500).send(err)
    }
}

const getAstroAvgRating = (score, res_rating, total_res) => {
    const score_rating = score.reduce(function (r, a, i) { return r + a * res_rating[i] }, 0);
    star_rating = (score_rating / total_res).toFixed(2)
    return star_rating
}

exports.getFeedbackForm = async (req, res) => {
    try {
        const rating_star = [5, 4, 3, 2, 1, 4.5, 3.5, 2.5, 1.5, 0.5]
        rating_len = []
        const astroId = req.params.id
        const feedbackform = await FeedbackForm.find({ astroId });
        feedbackform.map((value) => {
            rating_len.push(value.rating)
        })
        const len_of_fifth = rating_len.filter(x => x == 5).length
        const len_of_fourth = rating_len.filter(x => x == 4).length
        const len_of_third = rating_len.filter(x => x == 3).length
        const len_of_second = rating_len.filter(x => x == 2).length
        const len_of_one = rating_len.filter(x => x == 1).length

        const len_of_fifthPoint = rating_len.filter(x => x == 4.5).length
        const len_of_fourthPoint = rating_len.filter(x => x == 3.5).length
        const len_of_thirdPoint = rating_len.filter(x => x == 2.5).length
        const len_of_secondPoint = rating_len.filter(x => x == 1.5).length
        const len_of_onePoint = rating_len.filter(x => x == 0.5).length

        const res_rating = [len_of_fifth, len_of_fourth, len_of_third, len_of_second, len_of_one, len_of_fifthPoint, len_of_fourthPoint, len_of_thirdPoint, len_of_secondPoint, len_of_onePoint]

        const total_res = res_rating.reduce(function (a, v) { return a + v }, 0)

        const fivth_star_rating = ((len_of_fifth + len_of_fifthPoint) / total_res) * 100
        const fourth_star_rating = ((len_of_fourth + len_of_fourthPoint) / total_res) * 100
        const third_star_rating = ((len_of_third + len_of_thirdPoint) / total_res) * 100
        const second_star_rating = ((len_of_second + len_of_secondPoint) / total_res) * 100
        const first_star_rating = ((len_of_one + len_of_onePoint) / total_res) * 100

        const indivisualRating = {
            star5: fivth_star_rating,
            star4: fourth_star_rating,
            star3: third_star_rating,
            star2: second_star_rating,
            star1: first_star_rating,
        }

        getAstroAvgRating(rating_star, res_rating, total_res)
        res.status(200).json({ rating: { star_rating, indivisualRating }, feedback: feedbackform });

    } catch (err) {
        res.status(500).json(err);
    }
};