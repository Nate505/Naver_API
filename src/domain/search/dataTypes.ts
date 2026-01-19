import { Card } from "../cards/types";

export interface SearchResponse {
    cursor: number
    hasMore: boolean;
    total: number;
    data: Card[];
}