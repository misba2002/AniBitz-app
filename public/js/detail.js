document.addEventListener("DOMContentLoaded", () => {
  console.log("JS is running 🚀");

  const saveButton = document.querySelector("#saveButton");
  const removeButton=document.querySelector("#removeButton");
  const dataDiv = document.getElementById("anime-data");

  if (!saveButton || !dataDiv ||!removeButton) return;

  let animeData;
  try {
    animeData = JSON.parse(decodeURIComponent(dataDiv.dataset.anime));
  } catch (err) {
    console.error("Failed to parse anime data:", err);
    return;
  }

  saveButton.addEventListener("click", () => {
    console.log("animeData being sent to backend:", animeData);

    

    fetch("/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(animeData)
    })
    .then(res => res.json())
    .then(data => {
      if (data?.error) {
        alert(data.error);
        window.location.href = `/sing-up?redirect=${encodeURIComponent(window.location.href)}`;
        return;
      }
      
        saveButton.classList.add("clicked");
        saveButton.textContent = "Saved ✔️";
        alert("Anime saved to your list!");
        removeButton.style.display = "block";
        saveButton.style.display = "none";
        window.location.href = "/saved";
    })
      
      .catch(err => {
        console.error("Save failed:", err);
        alert("Failed to save anime. Try again!");
      });
  });






  removeButton.addEventListener("click",()=>{
     console.log("\nanimeData being sent to backend to remove anime:", animeData);

     fetch("/remove",{
      method:"DELETE",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify(animeData)

     })
    .then(res => res.json())
    .then(data => {
      if (data?.error) {
        alert(data.error);
        window.location.href = `/sing-up?redirect=${encodeURIComponent(window.location.href)}`;
        return;
      }
      
      alert(data.msg||"removed");
      removeButton.style.display = "none";
      saveButton.style.display = "block";
      saveButton.textContent = "Save"
      window.location.href = "/saved";
      

     })
     .catch(err=>{
       console.error("\nDeleting failed:", err);
        alert("Failed to Delete anime. Try again!");

     });

  })
});
