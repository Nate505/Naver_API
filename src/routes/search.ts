import express from "express";
import { searchSession } from "../domain/search/searchSession";
import { Card } from "../domain/cards/types";

const router = express.Router();

router.get("/", async (req, res) => {
    if(!req.query.url){
        return res.status(400).json({error: "Missing 'url' query parameter"});
    }
    const url = req.query.url as string;

    // search.ts
    const cards = await searchSession(url);

    if (!cards) {
        // Handle the case where runCDP exhausted retries or returned null
        throw new Error("Failed to retrieve data after multiple rotation attempts.");
    }

    // Now 'cards' is guaranteed to be Card[]
    console.log(`Found ${cards.length} cards.`);

    return res.json(cards);
})

export default router