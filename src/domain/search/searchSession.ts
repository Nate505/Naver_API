import { Card } from "../cards/types";
import { SearchResponse } from "./dataTypes"
import { ProxyAgent, fetch } from "undici";
import { runCDP } from "./runCDP";

export async function searchSession(urls: string){
    const url: URL = new URL(urls);
    let hasMore: boolean = true;
    let listPage: number = 1;
    const raw = url.searchParams.get("cursor"); 
    let cursor: number = raw ? parseInt(raw) : 0;
    
    const proxyAgent = new ProxyAgent({
        uri: "http://td-customer-mrscraperTrial-country-kr:P3nNRQ8C2@6n8xhsmh.as.thordata.net:9999",
        connect: {
            timeout: 10_000,
        },
    });
    
    async function fetchNextPage(){
        try{
            const query = url.searchParams.get("query") ?? "";
            const referer = "https://search.shopping.naver.com/ns/search?query=" + encodeURIComponent(query);
            
            const { cookieHeader, userAgent } = await runCDP(query);

            console.log(cookieHeader);

            const response = await fetch(url.toString(), {
                method: "GET",
                dispatcher: proxyAgent,
                headers: {
                    "User-Agent": userAgent,
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Referer": referer,
                    "Cookie": cookieHeader
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