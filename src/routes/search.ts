import express from "express";
import { searchSession } from "../domain/search/searchSession";
import { Card } from "../domain/cards/types";

const router = express.Router();

router.get("/", async (req, res) => {
    if(!req.query.url){
        return res.status(400).json({error: "Missing 'url' query parameter"});
    }
    const url = req.query.url as string;

    const cards: Card[] = await searchSession(url);

    return res.json(cards);
})

export default router