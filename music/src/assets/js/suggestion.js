
// getting all required elements
const searchInput = document.querySelector(".searchInput");
const input = searchInput.querySelector("input");
const resultBox = searchInput.querySelector(".resultBox");
const icon = searchInput.querySelector(".icon");
let linkTag = searchInput.querySelector("a");
let webLink;

// if user press any key and release
input.onkeyup = (e)=>{
    let userData = e.target.value; //user enetered data
    call_search(userData);
}

// if user click on search list then send request
$(document).on('click','.resultBox li', function(){
    $.ajax({
        type: "get",
        url: "http://127.0.0.1:8000/music/find/"+$(this).attr('id'),
        dataType: "json",
        success: function (response) {
            musicName.innerText = response['name'];
            musicArtist.innerText = response['title'];
            musicImg.src = `http://127.0.0.1:8000${response['img']}`;
            mainAudio.src = `http://127.0.0.1:8000${response['src']}`;
            // clean search bar
            $('input').val('');
            // hide search suggestion 
            $('.searchInput').removeClass('active');
            resultBox.innerHTML = '';
        }
    });
})
 
// show suggestion

function showSuggestions(list){
    let listData; 
    if(!list.length){
        userValue = $('input').val()
        listData = '<li>'+ userValue +'</li>';
    }else{
        listData = list.join('');
    }
    resultBox.innerHTML = listData;
}

// if user click in body then close & clean search
$('body').click(function () { 
    searchInput.classList.remove("active");
    $('input').val('')
});


$('.searchInput').click(function () { 
    call_search($('input').val());
});

// create suggestion list with DB
function call_search(userData){
    var emptyArray = [];
    if(userData !=''){
        $.ajax({
            type: "GET",
            url: "http://127.0.0.1:8000/music/list/"+userData,
            dataType: "json",
            success: function (response) { 
                emptyArray = [];
                emptyID = [];
                response.forEach(element => {
                    emptyArray.push(element.name)
                });
                if(emptyArray != ''){
                    emptyArray = emptyArray.map((data)=>{
                        // passing return data inside li tag
                        return data = '<li>'+ data +'</li>';
                    });
                    searchInput.classList.add("active"); //show autocomplete box
                    showSuggestions(emptyArray);
                    let allList = resultBox.querySelectorAll("li");
                    for (let i = 0; i < allList.length; i++) {
                        //adding onclick attribute in all li tag
                        allList[i].setAttribute("id", response[i]['slug']);
                    }
                }else{
                    searchInput.classList.remove("active"); //hide autocomplete box
                }
            }
        });
    }else{
        searchInput.classList.remove("active");
    }
}

