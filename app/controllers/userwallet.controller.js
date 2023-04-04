const db = require('../models');
const { userwallet: UserWallet } = db;


exports.addUserWallet = async (req, res) => {
    try {
        const userId = req.params.id
        const findUser = await UserWallet.findOne({ userId: userId });
        if (findUser == null) {
            const data = {
                userId: req.body.userId,
                wallet: {
                    amount: req.body.amount,
                    action: req.body.action,
                    subTotal: 0,
                    walletUpdated_at: req.body.walletUpdated_at,
                    particular: req.body.particular,
                },
                total: req.body.total,
            }

            const storeData = new UserWallet(data);
            const savedData = await storeData.save();
            res.status(201).send(savedData)
        } else {
            const newData = {
                amount: req.body.amount,
                action: req.body.action,
                subTotal: req.body.action ? findUser.total + req.body.amount : findUser.total,
                walletUpdated_at: req.body.walletUpdated_at,
                particular: req.body.particular,
            }

            const update = await UserWallet.updateOne({ userId: userId }, { $push: { wallet: newData } })
            if (req.body.action == true) {
                const totalamountadd = findUser.total + req.body.amount
                const updatedData = await UserWallet.updateOne({ userId: userId }, { $set: { total: totalamountadd } })
            } else {
                const totalamountminus = findUser.total - req.body.amount
                const updatedData = await UserWallet.updateOne({ userId: userId }, { $set: { total: totalamountminus } })
            }
            res.status(202).send(updatedData)
        }
    }
    catch (error) {
        res.status(500).send(error.message)
    }
}


async function updateWallet(amount, action = true, subtotal = 0, particular = "stripe", userId) {
    try {
        const findUser = await UserWallet.findOne({ userId: userId });
        if (findUser == null) {
            const data = {
                userId: userId,
                wallet: {
                    amount: amount,
                    action: action,
                    subTotal: 0,
                    walletUpdated_at: new Date(),
                    particular: particular,
                },
                total: subtotal,
            }

            const storeData = new UserWallet(data);
            const savedData = await storeData.save();
            // res.status(201).send(savedData)
        } else {
            const newData = {
                amount: amount,
                action: action,
                subTotal: findUser.total,
                walletUpdated_at: new Date(),
                particular: particular,
            }

            const update = await UserWallet.updateOne({ userId: userId }, { $push: { wallet: newData } })
            const updatedData = await UserWallet.updateOne({ userId: userId }, { $set: { total: findUser.total + newData.amount } })
        }
    }
    catch (error) {
        console.log(error)
    }
}


exports.getWallet = async (req, res) => {
    const _id = req.params.id
    try {
        const [data] = await UserWallet.find({ userId: _id })
        res.status(200).send(data)
    } catch (error) {
        res.status(500).send(error)
    }
}


exports.updateWallet = updateWallet;