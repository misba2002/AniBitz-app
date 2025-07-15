
document.addEventListener("DOMContentLoaded",()=>{

   const submitForm= document.getElementById("formSubmit");

//    debug
console.log("\nform element:",submitForm);

if(!submitForm){
    alert("error try in a while!");
    return;
    
}

submitForm.addEventListener("submit",function(e){
    e.preventDefault();


    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get("redirect") || "/";

    const email=document.getElementById("floatingInput").value;
    const password=document.getElementById("floatingPassword").value;

    
   
    console.log("emial and passowrd",email+"\npassword:",password);

    fetch("/signup",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ email, password,redirectTo })
    })
    .then(res=>res.json())
    .then(data=>{
         if (data.success) {
      alert(data.message); // ✅ success message
       window.location.href = data.redirectTo || "/";
      
    } else {
      alert(`❌ ${data.message}`); // ❌ error message
    }
    })
    .catch(err => {
    console.error(err);
    alert('Something went wrong on the client side 😢');
  });

});





});