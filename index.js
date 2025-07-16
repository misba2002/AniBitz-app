import express  from "express";
import axios  from "axios";
import {promises as fs} from "fs";




const port = process.env.PORT || 4000;
const app=express();
const url="https://api.jikan.moe/v4/top/anime?filter=airing";
const Url_top="https://api.jikan.moe/v4/top/anime?limit=10";
const url_popular="https://api.jikan.moe/v4/top/anime?order_by=members&sort=desc&limit=1";
const url_rated="https://kitsu.io/api/edge/anime?sort=ratingRank&page[limit]=3";
const url_new="https://kitsu.io/api/edge/anime?filter[status]=current&sort=-startDate&page[limit]=3";
const url_top_ten="https://kitsu.io/api/edge/anime?sort=ratingRank&page[limit]=10";
const savedAnimeFile="files/savedData.json";
const userDataFile="files/userData.json";

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.json());



async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
    const axiosOptions = { timeout: 5000, ...options };
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(url, axiosOptions);
            return response; // 🔷 return full axios response
        } catch (err) {
            if (attempt === retries) {
                console.error(`❌ Failed after ${retries} attempts:`, err.message);
                throw err;
            }
            console.warn(`⚠️ Attempt ${attempt} failed (${err.message}), retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // exponential backoff
        }
    }
}




async function checkSignedUp(req, res, next) {
  try {
    const raw = await fs.readFile(userDataFile, "utf-8");
    const users = raw.trim() === "" ? [] : JSON.parse(raw);

    if (users.length === 0) {
      // no users signed up yet
      return res.json({
        error: "🚫 You need to sign up before using this feature."
      });
    }

    next(); // ✅ at least one user exists
  } catch (err) {
    console.error("Error reading user data:", err);
    res.json({ error: "Server error. Try again later!" });
  }
}

app.get("/", async(req,res)=>{
    
    try{
        const Response=await fetchWithRetry(url);//currently airing anime
        const topResponse=await fetchWithRetry(Url_top);//top-10 anime of all time 

        const result = Response.data.data.slice(0,3);//slicing to get only 3 curently airing anime

        let topResult=topResponse.data.data.slice(0,4);//getting top 10 anime data and slicing it to 4

        console.log("\nmain-page-anime-data");
        console.log("top-anime length:"+topResult.length); 
        console.log("imgae url for top airing anime:"+topResult[0].images.jpg.image_url);
        console.log("top anime title name:"+topResult[0].title_english);
        console.log("imgae url for top airing anime:"+topResult[1].images.jpg.image_url);
        console.log("top anime title name:"+topResult[1].title_english);
        console.log("imgae url for top airing anime:"+topResult[2].images.jpg.image_url);
        console.log("top anime title name:"+topResult[2].title_english);
       
        
        console.log("\ntop-ten-anime-data-main-page");
        console.log("length:"+result.length);
        console.log("image url:"+result[0].images.jpg.large_image_url);
        console.log("anime title:"+result[0].title_english);
        console.log("image url:"+result[1].images.jpg.large_image_url);
        console.log("anime title:"+result[1].title_english);
        console.log("image url:"+result[2].images.jpg.large_image_url);
        console.log("anime title:"+result[2].title_english);
       
       
        
       
        res.render("index.ejs",{content:result,topContent:topResult});


    }catch(err){
         console.log("error while fetich explore data:"+err);

    }
     
   
});

app.get('/explore', async(req, res) => {

    try{
        const responsePopular=await fetchWithRetry(url_popular);//getting popular anime data
        let popularResult=responsePopular.data.data[0];//single data

        // debug:
         console.log("\npopular-anime-data");
        console.log("popular anime imge url:"+popularResult.images.jpg.image_url);
        console.log("popular anime title:"+popularResult.title_english);
        console.log("popular anime description:"+popularResult.background);


        const reponseRated= await fetchWithRetry(url_rated);//getting top rated anime data
        let ratedResult=reponseRated.data.data;//array of data length 3

        //debug:
         console.log("\nnew-rated-anime-data");
        console.log("rated anime img url:"+ratedResult[0].attributes.posterImage.small);
        console.log("rated title name:"+ratedResult[0].attributes.titles.en);

        const responseNew=await fetchWithRetry(url_new);//getting top new released anime
        let newResult=responseNew.data.data;//getting array of data length 3

         //debug:
          console.log("\nNew-released-anime-data");
        console.log("new anime img url:"+newResult[0].attributes.posterImage.small);
        console.log("new title name:"+newResult[0].attributes.titles.en);




         res.render('partials/explore.ejs',{
            mostContent:popularResult,
            ratedContent:ratedResult,
            newContent:newResult
        });

    }catch(err){
        console.log("error while fetich explore data:"+err);

    }


  
});



app.get("/topTen",async(req,res)=>{
    try{
        const topTenResponse=await fetchWithRetry(url_top_ten);//getting top ten anime
        let topTenresult=topTenResponse.data.data;//data


        //debug:
        console.log("\ntop-ten-anime-data");
        console.log("rated anime img url:"+topTenresult[0].attributes.posterImage.small);
        console.log("rated title name:"+topTenresult[0].attributes.titles.en);

        res.render("partials/topTen.ejs",{newtopnew:topTenresult})

         




    }catch(err){
         console.log("error while fetich top-ten data:"+err);
    }

});


app.post("/saved",checkSignedUp, async(req,res)=>{

    try{

   
    const savedAnime=req.body;
     let existingData=[];
    try {
       
        // read saved anime file
        let rawData=await fs.readFile(savedAnimeFile,"utf-8");
        existingData=rawData.trim()=== "" ? []:JSON.parse(rawData);
        
    } catch (readErr) {
        console.log("error during readng the existing savedAnimeFile!:"+readErr);
        existingData=[];
        
    }
    // checking for duplicates
    const isDuplicate = existingData.some(item => item.id === savedAnime.id && item.source === savedAnime.source);
    if (!isDuplicate) {
        // push new data to exiting data
        existingData.push(savedAnime);
        console.log("\nnew anime got addes to savedAnimeFile!");
    }



   

    //adding all the data to the file
    await fs.writeFile(savedAnimeFile,JSON.stringify(existingData,null,2));
    console.log("file saved succesfully!")
    res.json({ message: "Saved successfully!" });

}catch(writeErr){
  console.log("error while saving  anime file!"+writeErr);
    // 🔴 RETURN ERROR RESPONSE
res.json({ error: "Failed to save anime" });
  
}

});


app.get("/saved",async(req,res)=>{

    console.log("incoming save request:");
   
 
    try{
        // reading the updated file and rendering it to saved.ejs file
        const data=await fs.readFile(savedAnimeFile,"utf-8");
        const posts=data.trim()===""?[]:JSON.parse(data);
        res.render("partials/saved.ejs", { savedAnimeList: posts });
        console.log("\ndata sucessfuly rendered!");



    }catch(err){
         console.log("error while passing saved anime data file!");
          res.render("partials/saved.ejs", { savedAnimeListError: "error refresh and try again!"+err});

    }
    
  
});

app.get("/View",async(req,res)=>{
    const DanimeId=req.query.id;
    const DanimeSource=req.query.source;

    //debug:
    console.log("\ndetailed page view debug:")
    console.log("1:anime id"+DanimeId);
    console.log("2:anime source"+DanimeSource);


    
    let specificAnimeData;
    let isAnimeSaved=false;//to check wheater te anime is already present in the saved list.

    try{
         

        if(DanimeSource==="jikan"){
            const Dreponse=await fetchWithRetry(`https://api.jikan.moe/v4/anime/${DanimeId}`);
            let detailedResult=Dreponse.data.data;

           specificAnimeData={
                id: detailedResult.mal_id,
                source: "jikan",
                title_english: detailedResult?.title_english,
                title_japanese: detailedResult?.title_japanese,
                start_date: detailedResult?.aired?.from?.split("T")[0],
                episodes: detailedResult?.episodes,
                synopsis: detailedResult?.synopsis,
                images: detailedResult?.images?.jpg?.large_image_url,
                status: detailedResult?.status
            };

            console.log("specific anime data from detiled page of source jikan:\n",specificAnimeData);
        }
         else if(DanimeSource==="kitsu"){
            const Dreponse=await fetchWithRetry(`https://kitsu.io/api/edge/anime/${DanimeId}`);
            let detailedResulty=Dreponse.data.data;
           
             specificAnimeData={
                id: detailedResulty.id,
                source: "kitsu",
                title_english: detailedResulty?.attributes?.titles?.en_jp ||detailedResulty?.attributes?.titles?.en_cn || detailedResulty?.attributes?.canonicalTitle,
                title_japanese: detailedResulty?.attributes?.titles?.ja_jp ||detailedResulty?.attributes?.titles?.zh_cn||detailedResulty?.attributes?.titles?.ko_kr,
                start_date: detailedResulty?.attributes?.startDate,
                episodes: detailedResulty?.attributes?.episodeCount,
                synopsis: detailedResulty?.attributes?.synopsis,
                images: detailedResulty?.attributes?.posterImage?.original,
                status: detailedResulty?.attributes?.status
            };

            console.log("specific anime data from detiled page of source kitsu:\n",specificAnimeData);
        }

       //Checking  if anime is already saved  
       const rawfile=await fs.readFile(savedAnimeFile,"utf-8");
       const savedList =rawfile.trim()===""?[]:JSON.parse(rawfile);
       isAnimeSaved=savedList.some((item)=>item.id===specificAnimeData.id&&item.source===specificAnimeData.source);
       
       





       res.render("partials/details.ejs",{animeData:specificAnimeData,isAnimeSaved});

    }catch(err){
        console.log("\nerror in detailed veiw :"+err)
        res.render("partials/details.ejs",{animeDataError:err});
         

    }




   
});

app.delete("/remove",checkSignedUp,async(req,res)=>{
    
    try{
        const animeToRemove=req.body;
        // debug line:
        console.log("\nremoving data anime data from /remove route:",animeToRemove);

        if (!animeToRemove.id || !animeToRemove.source) {
         return res.json({ msg: "Invalid anime data" });
        }
         
        let rawData=await fs.readFile(savedAnimeFile,"utf-8");
        let  existingData=rawData.trim()===""?[]:JSON.parse(rawData);

        let updatedData=existingData.filter(item=>{
           return !(item.id===animeToRemove.id&&item.source===animeToRemove.source)
        });

        await fs.writeFile(savedAnimeFile,JSON.stringify(updatedData,null,2));
        console.log(`Anime removed: ID=${animeToRemove.id}, Source=${animeToRemove.source}`);

        res.json({msg:"Anime successfully removed!"});

        



    }catch(err){
         console.error("Error while removing anime:", err);
         res.json({msg:err});

    }

});


app.get("/sing-up",(req,res)=>{
    res.render("partials/signup.ejs");
})



app.post("/signup",async(req,res)=>{

  const { email, password } = req.body;
 console.log("Sign-up attempt:", email, password);

   
  
try{
    let rawData=await fs.readFile(userDataFile,"utf-8");
    let dataUser=rawData.trim()===""?[]:JSON.parse(rawData);
    // checking if username already exist!
    const userExist=dataUser.find(u=>u.email===email);
    // if exist return 
    if(userExist){
        res.json({
            success:false,
            message:" ❌username already exist try with diffrent"
        })
    }
    // if dosent exit add the user detailes
    dataUser.push({email,password});

    // upadte the file with new user emial anf password
    await fs.writeFile(userDataFile,JSON.stringify(dataUser,null,2));

    // alert the user about saving the user credentials
    res.json({
        success:true,
        message:"user signed up sucessfully!",
        redirectTo: req.body.redirectTo || "/"
    })
    


}catch(err){
     console.error("Error saving user data:", err);
     res.json(
        { success: false,
         message: "Server error. Please try again."
        });
 

}
    
    



    

    

});


app.get("/search",async(req,res)=>{

    const searchValue=req.query.q;


    // if the vlue is empty!
    if(!searchValue){
       return res.render("partials/search.ejs",{
            results:[],
            message:"No search term provided!"

        });
        
    }

    // if user searched for anime then
    try {

        const searchResponse=await fetchWithRetry( `https://api.jikan.moe/v4/anime`,{
            params:{
                q:searchValue,
                limit:1
            }
        });

        let searchResults=searchResponse.data.data;

        if(!searchResults){
            console.log("\nsearch results are undefined !");
            return res.render("partials/search.ejs",{
            results:[],
            message:"No results for your check and try again later!"

        });
        
        }

        // debug
        console.log("\n result from search value length of data:"+searchResults.length);
        console.log("\nhere is the first data from result:"+JSON.stringify(searchResults[0],null,2));

          return res.render("partials/search.ejs",{
            results:searchResults
          });

        
    } catch (error) {
        console.log("error while getting the search query results:");
         return res.render("partials/search.ejs",{
            results:[],
            message:"error at server side"+error
          });
        
    }


    

});


app.listen(port,(req,res)=>{
    console.log(`server is running on port no:${port}`);
});
