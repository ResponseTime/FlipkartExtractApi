# FlipkartExtractApi

<img src="https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white"/> <img src="https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white"/> <img src="https://img.shields.io/badge/MongoDB-47A248.svg?style=for-the-badge&logo=MongoDB&logoColor=white"/> <img src="https://img.shields.io/badge/Render-46E3B7.svg?style=for-the-badge&logo=Render&logoColor=white"/>
<br>

- Designed and implemented JWT-based authentication endpoints using Node.js and Express.
- Established user registration and login functionalities while securely storing hashed passwords in MongoDB.
- Developed a robust API endpoint to ingest Flipkart URLs utilizing the axios library for HTTP requests.
- Employed cheerio to parse product details including title, price, description, reviews, and media count from fetched data.
- Orchestrated the organized storage of scraped information in a MongoDB collection linked to specific users.
- Engineered an API route enabling authenticated users to retrieve stored product data based on their URLs.
- Implemented thorough error handling mechanisms for cases where URLs didn't align with user profiles or weren't present in the database.
- Successfully deployed the web scraping and authentication API on Render
