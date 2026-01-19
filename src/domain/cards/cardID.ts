import { Card } from "./types"

function CardIDs(cd: Card){
    let AD: boolean = false;
    const productDetail = cd.product;
    let realProduct: boolean =  false;

    if(productDetail.cardType === "AD" || productDetail.adid != "" || productDetail.impressionEventUrl != ""){
        AD = true;
    }else if(productDetail.cardType != "AD" && productDetail.naverPaySellerNo != 0 && productDetail.channelNo != 0){
        realProduct = true;
    }

    if(AD){
        return "AD";
    }else if(realProduct){
        return "Product";
    }else{
        return "Unknown";
    }
}