import Card from '../models/Card.model.js';

export const addCard = async (req, res) => {
    try {
        const { bank, cardType, lastFourDigits, expiryMonth, expiryYear } = req.body;
        const card = await Card.create({
            userId: req.user.id,
            bank,
            cardType,
            lastFourDigits,
            expiryMonth,
            expiryYear
        });
        res.status(201).json(card);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getCards = async (req, res) => {
    try {
        const cards = await Card.find({ userId: req.user.id });
        res.json(cards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};