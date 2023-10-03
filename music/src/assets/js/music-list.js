// To add more song, just copy the following code and paste inside the array

//   {
//     name: "Here is the music name",
//     artist: "Here is the artist name",
//     img: "image name here - remember img must be in .jpg formate and it's inside the images folder of this project folder",
//     src: "music name here - remember img must be in .mp3 formate and it's inside the songs folder of this project folder"
//   }

//paste it inside the array as more as you want music then you don't need to do any other thing

let allMusic = [
  {
    name: "Harley Bird - Home",
    artist: "Jordan Schor",
    img: "music-1",
    src: "music-1"
  },
  {
    name: "Ikson Anywhere – Ikson",
    artist: "Audio Library",
    img: "music-2",
    src: "music-2"
  },
  {
    name: "Beauz & Jvna - Crazy",
    artist: "Beauz & Jvna",
    img: "music-3",
    src: "music-3"
  },
  {
    name: "Hardwind - Want Me",
    artist: "Mike Archangelo",
    img: "music-4",
    src: "music-4"
  },
  {
    name: "Jim - Sun Goes Down",
    artist: "Jim Yosef x Roy",
    img: "music-5",
    src: "music-5"
  },
  {
    name: "Lost Sky - Vision NCS",
    artist: "NCS Release",
    img: "music-6",
    src: "music-6"
  },
  // like this paste it and remember to give comma after ending of this bracket }
  // {
  //   name: "Here is the music name",
  //   artist: "Here is the artist name",
  //   img: "image name here - remember img must be in .jpg formate and it's inside the images folder of this project folder",
  //   src: "music name here - remember img must be in .mp3 formate and it's inside the songs folder of this project folder"
  // }
];





// if user press any key and release
input.onkeyup = (e)=>{
    let userData = e.target.value; //user enetered data
    let emptyArray = [];
    if(userData){
        emptyArray = suggestions.filter((data)=>{
            //filtering array value and user characters to lowercase and return only those words which are start with user enetered chars
            return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase()); 
        });
        emptyArray = emptyArray.map((data)=>{
            // passing return data inside li tag
            return data = '<li>'+ data +'</li>';
        });
        searchInput.classList.add("active"); //show autocomplete box
        showSuggestions(emptyArray);
        let allList = resultBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            //adding onclick attribute in all li tag
            allList[i].setAttribute("onclick", "select(this)");
        }
    }else{
        searchInput.classList.remove("active"); //hide autocomplete box
    }
}




