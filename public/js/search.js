document.addEventListener("DOMContentLoaded",()=>{

const input=document.getElementById("searchInput");
const icon=document.getElementById("searchIcon");
const backBtn=document.querySelector(".back-search-btn");

if(!input&&!icon){
    return;
}

window.addEventListener("pageshow", () => {
  const input = document.getElementById("searchInput");
  if (input) input.value = "";
});



function  performSearch(){
    const value=input.value.trim();
    // if value is empty
      if (!value) return alert("Enter something to search!");

    // send the value as query parameter
    window.location.href=`/search?q=${encodeURIComponent(value)}`;  

}

input.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){
         performSearch();
    }

});

icon.addEventListener("click",()=>{
   performSearch();
});

if(!backBtn){
      console.log("Back button not found!");
    return;
}

backBtn.addEventListener("click",()=>{
    console.log("Back button clicked!");
      
  backBtn.style.transform = "scale(0.95)";
  backBtn.style.opacity = "0.7";



  setTimeout(() => {
    
    window.history.back();
    

  }, 200);
    
   

});


});

