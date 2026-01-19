import { Card } from "../cards/types";
import { SearchResponse } from "./dataTypes"

async function searchSession(urls: string){
    const url: URL = new URL(urls);
    let hasMore: boolean = true;
    let listPage: number = 1
    const raw = url.searchParams.get("cursor"); 
    let cursor: number = raw ? parseInt(raw) : 0;

    async function fetchNextPage(){
        try{
            const response = await fetch(url);

            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const search: SearchResponse = await response.json();

            listPage++;
            cursor = search.cursor;
            hasMore = search.hasMore;

            url.searchParams.set("cursor", cursor.toString());
            if(listPage > 1){
                url.searchParams.set("listPage", listPage.toString());
            }

            return search.data;

        } catch (error){
            console.error("Could not fetch users:", error);
            return [];
        }
    }

    let cards: Card[] = [];
    while(hasMore){
        const pageResult = await fetchNextPage();
        cards.push(...pageResult)
    }

    return cards;
}