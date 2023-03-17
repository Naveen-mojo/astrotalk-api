const db = require('../models');
const { conversation: Conversation } = db;

// Add Conversation
exports.addConversation = async (req, res) => {
    // if (!req.body.senderId || !req.body.receiverId) {
    //     res.status(400).send({ message: "please fill all required fields" })
    //     return;
    // }
    // const newConversation = new Conversation({
    //     members: [req.body.receiverId, req.body.senderId],
    // });

    const newConversation = new Conversation({
        "astroId": req.body.astroId,
        "userId": req.body.userId,
        "message": {
            "text": req.body.textMesg,
            "sender": req.body.sender,
            "chattime": new Date()
        }
    })

    try {

        const conversationFind = await Conversation.findOne({
            astroId: req.body.astroId, userId: req.body.userId,
        });

        console.log("conversationFind", conversationFind);

        if (conversationFind) {
            const data = await Conversation.message.updateMany({ _id: conversationFind._id }, {
                $set: [{
                    text: 'Helllo',
                    sender: 'astro',
                    chattime: new Date()
                },
                {
                    text: 'Helllo',
                    sender: 'astro',
                    chattime: new Date()
                }]
            }, {
                new: true
            })
            console.log("data", data);   
        }
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get Conversation 
exports.getConversation = async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get Conversation Include Two user id

exports.getConversationUsers = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] },
        });
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err);
    }
};