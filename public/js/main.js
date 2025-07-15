// JS FOR BUTTONS FOR HEADER 



const path = window.location.pathname;

  if (path === "/"||path==="/topTen"||path.startsWith("/View")
  ) {
    document.querySelector(".homebtn").classList.add("active-btn");
  } else if (path === "/explore") {
    document.querySelector(".explorebtn").classList.add("active-btn");
  } else if (path === "/saved") {
    document.querySelector(".savedbtn").classList.add("active-btn");
  } else if (path === "/sing-up") {
    document.querySelector(".loginbtn").classList.add("active-btn");
  }