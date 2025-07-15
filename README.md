# AniBitz 🎥✨ — Anime Explorer Web App

AniBitz is a full-stack Node.js web application that lets you explore, search, and save your favorite anime titles.  
It fetches real-time data from public anime APIs (Jikan & Kitsu) and allows you to manage your saved anime collection.  

---

## 🚀 Features

✅ View currently airing, top-rated, and most popular anime  
✅ Search anime by name  
✅ View detailed info about any anime  
✅ Save and remove your favorite anime  
✅ User signup system to enable saving  
✅ Responsive & visually engaging interface  
✅ Video backgrounds, custom styles, and clean UX

---

## 🛠️ Tech Stack

| **Category**           | **Tech / Tools**                      |
|------------------------|---------------------------------------|
| Backend                | Node.js, Express.js                   |
| Frontend Templating    | EJS                                   |
| Styling                | CSS3, Responsive Design               |
| APIs                   | [Jikan API](https://jikan.moe/) & [Kitsu API](https://kitsu.docs.apiary.io/) |
| Data Storage           | JSON files (`files/userData.json`, `files/savedData.json`) |
| Package Manager        | npm                                   |
| Dev Tools              | Git, GitHub, Postman (optional)       |
| Frontend Framework     | Bootstrap 5, CSS3                     |


---

## 📂 Folder Structure
AniBitz-app/
├── files/
│ ├── userData.json
│ └── savedData.json
├── public/
│ ├── images/
│ ├── js/
│ ├── styles/
│ └── vedios/
├── views/
│ ├── index.ejs
│ └── partials/
├── index.js
├── package.json
├── .gitignore
└── README.md


---

## 🔗 APIs Used

- **Jikan API** — For anime data from MyAnimeList  
  Example endpoints:
  - Top airing: `https://api.jikan.moe/v4/top/anime?filter=airing`
  - Search anime: `https://api.jikan.moe/v4/anime?q=QUERY`
  - Anime details: `https://api.jikan.moe/v4/anime/:id`

- **Kitsu API** — For top-rated and newly released anime
  Example endpoints:
  - Top rated: `https://kitsu.io/api/edge/anime?sort=ratingRank`
  - Newly released: `https://kitsu.io/api/edge/anime?filter[status]=current`

---

## 📋 How to Run Locally

1️⃣ Clone the repository:
```bash
git clone https://github.com/misba2002/AniBitz-app.git
cd AniBitz-app

2️⃣ Install dependencies:
npm install

3️⃣ Start the server:
node index.js

4️⃣ Open in your browser:
http://localhost:4000

👩‍💻 Key Routes
Route	Description
/Home page with top airing & trending
/explore Popular, new & top-rated anime
/topTen	Top 10 rated anime
/search?q=yourQuery	Search for an anime
/View?id=xxx&source=xxx	Detailed page for a specific anime
/saved	View your saved anime list
/signup	Signup page to enable saving
/remove	DELETE route to remove a saved anime

#👨‍🎓 Notes for Reviewers 
**This project showcases:**

1.API integration with two different providers.

2.Asynchronous file I/O (fs.promises) for persistent storage.

3.RESTful routing and proper middleware (checkSignedUp).

4.Clean EJS templates and responsive CSS.

5.Error handling for API & file operations.
