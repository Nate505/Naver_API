import { Card } from "../cards/types";
import { SearchResponse } from "./dataTypes"
import { ProxyAgent, fetch } from "undici";

export async function searchSession(urls: string){
    const url: URL = new URL(urls);
    let hasMore: boolean = true;
    let listPage: number = 1;
    const raw = url.searchParams.get("cursor"); 
    let cursor: number = raw ? parseInt(raw) : 0;
    
    const proxyAgent = new ProxyAgent({
        uri: "http://undjpses:xfro5kl937n7@142.111.48.253:7030",
        connect: {
            timeout: 10_000,
        },
    });
    
    async function fetchNextPage(){
        try{
            const query = url.searchParams.get("query") ?? "";
            const referer = "https://search.shopping.naver.com/search/all?query=" + encodeURIComponent(query);
            
            const response = await fetch(url.toString(), {
                method: "GET",
                dispatcher: proxyAgent,
                headers: {
                    "User-Agent": pickRandomUA(),
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Referer": referer
                }
            });
            
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const search = (await response.json()) as SearchResponse;
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
    const pageResult = await fetchNextPage();
    cards.push(...pageResult);
    await sleep();
    
    return cards;
}

function sleep(): Promise<void> {
    const minDelay = 2000;
    const maxDelay = 4000;
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    return new Promise(resolve => setTimeout(resolve, delay));
}

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
];

function pickRandomUA(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}