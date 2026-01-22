# Naver_API

1. Run the scripts by:
```bash
npm run dev
```

2. Start a Ngrok Server:
```bash
ngrok http 3000
```

3. Send a get Request Example Below (Remember To Change Query Param):
```bash
GET https://your-ngrok-server/naver?url=https://search.shopping.naver.com/ns/v1/search/paged-composite-cards?cursor=1%26pageSize=50%26query=What-You-Want-To-Search-For%26searchMethod=displayCategory.basic%26isCatalogDiversifyOff=true%26hiddenNonProductCard=false%26hasMoreAd=false%26onlySecondhand=false%26onlyRental=false%26onlyOversea=false
```
