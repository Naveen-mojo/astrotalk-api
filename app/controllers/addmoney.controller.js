const mongoose = require('mongoose');
const db = require('../models');
const { addwallet: AddWallet } = db;

exports.addMoneyWallet = async (req, res) => {
    try {
        if (!req.body) {
            if (!req.body) {
                res.status(400).send({ message: "please fill all required fields" });
                return;
            }
        }

        const addMoney = new AddWallet(req.body)
        const saveMoney = await addMoney.save()
        if (!saveMoney) {
            res.status(400).send({ message: "please fill all required fields" });
        }
        res.status(201).send({ message: 'Data Uploaded Successfully!', data: saveMoney, status: 1 })
    } catch (error) {
        res.status(500).send({ message: error })
    }
}

exports.getWalletMoney = async (req, res) => {
    try {
        const getwallet = await AddWallet.find({
            active: 1
        }).sort({ amount: 1 })
        res.status(200).send(getwallet)
    } catch (error) {
        res.status(500).send({ message: error })
    }
}