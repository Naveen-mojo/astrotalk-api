const db = require('../models');
const { videocall: VideoCall } = db;

exports.addVideoCall = async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).send({ message: "please fill all required fields" });
            return;
        }

        const data = new VideoCall(req.body)
        const saveData = await data.save()
        res.status(201).send({ message: "Video Call Created Successfully!", data: saveData })

    } catch (error) {
        res.status(500).send(error)
    }
}

exports.getVideoCall = async (req, res) => {
    try {
        const data = await VideoCall.find({})
        res.status(200).send({ message: "Video Call Data Recived.", status: 1, data: data })
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.updateVideoCall = async (req, res) => {
    const _id = req.params.id
    try {
        const data = await VideoCall.updateOne({ _id }, { $set: { endTime:req.body.endTime, status: req.body.status } }, {
            new: true
        })
        res.status(200).send({ message: "Data Updated Successfully!", data: data })
    } catch (error) {
        res.status(500).send(error)
    }
}