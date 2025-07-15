
document.addEventListener("DOMContentLoaded",()=>{
    console.log("JS is loaded 🎉");

  


    if (!document.getElementById("anime-data")) return;
     const dataDiv = document.getElementById("anime-data");

    if (!dataDiv) {
        console.warn("anime-data div not found");
        return;
    }

    let animeData;
    try {
        const raw = document.getElementById("anime-data").dataset.anime;
       animeData = JSON.parse(decodeURIComponent(raw));

    
    } catch (error) {
        console.error("Failed to parse anime data", error);
        return;
    }

    if (!animeData || animeData.length === 0) {
        console.warn("Anime data is empty or invalid");
        return;
    }

    let currentIndex=0;   
    const imageElement=document.querySelector(".anime-images");
    const nameElement=document.querySelector(".content-showname");
    const leftBtn=document.querySelector(".leftbtn");
    const rightBtn=document.querySelector(".rightbtn");
    const animeLink = document.getElementById("anime-link-hai");


    function updateContent(index){
        const anime=animeData[index];
        imageElement.src=anime.images?.jpg?.large_image_url || "/images/anime-style-people-with-fire.jpg";
        nameElement.textContent=anime.title_english || anime.title || "Flare of Youth";

       
          animeLink.href =`/View?id=${anime.mal_id}&source=jikan`;
    }

    leftBtn.addEventListener("click",()=>{
        currentIndex=(currentIndex-1+animeData.length)%animeData.length;
        updateContent(currentIndex);
    });

    rightBtn.addEventListener("click",()=>{
        currentIndex=(currentIndex+1)%animeData.length;
        updateContent(currentIndex);

    });

    setInterval(()=>{
        currentIndex=(currentIndex+1)%animeData.length;
        updateContent(currentIndex);

    },5000);

    updateContent(currentIndex);

    
    });






