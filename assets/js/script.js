let quizTime=120
var fetchurl="https://opentdb.com/api.php?amount=1&type=multiple"
var timesec=quizTime
let quesionno=0
let answerd=0
let scorevalue=0
let correctans=""
let currectvalue=-1
let istimestarted=0
let correct=0
let wrong=0
var elements = document.getElementsByTagName("input");
function unselectradio(){
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].type == "radio") {
            elements[i].checked = false;
        }
    }
}
let timeEle=document.getElementById("time")
let option1=document.getElementById("option1")
let option2=document.getElementById("option2")
let option3=document.getElementById("option3")
let option4=document.getElementById("option4")
let option1in=document.getElementById("option1in")
let option2in=document.getElementById("option2in")
let option3in=document.getElementById("option3in")
let option4in=document.getElementById("option4in")
let isanscorrect=document.getElementById("isanscorrect")
let displayscore=document.getElementById("displayscore")
let nextQuestion=document.getElementById("nextQuestion")
let randomarray;
let questions=document.getElementById("questions")
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }
function getQuesAndAns(fetchurl){
    nextQuestion.innerHTML="Loading..."
    $.ajax({
        method: 'GET',
        url: fetchurl,
        success: function (responce) {
            if(responce["response_code"]==0){
                unselectradio()

                questions.innerHTML=responce.results[0]["question"]
                ansarray=responce.results[0]["incorrect_answers"]
                ansarray.push(responce.results[0]["correct_answer"])
                correctans=responce.results[0]["correct_answer"]
                randomarray=shuffle(ansarray)
                option1.innerHTML=randomarray[0]
                option2.innerHTML=randomarray[1]
                option3.innerHTML=randomarray[2]
                option4.innerHTML=randomarray[3]
                option1in.value=randomarray[0]
                option2in.value=randomarray[1]
                option3in.value=randomarray[2]
                option4in.value=randomarray[3]
                currectvalue=randomarray.indexOf(correctans)
                option1in.disabled=false
                option2in.disabled=false
                option3in.disabled=false
                option4in.disabled=false
                option1.style.color="black"
                option2.style.color="black"
                option3.style.color="black"
                option4.style.color="black"
                isanscorrect.innerHTML=""
                quesionno++
                nextQuestion.innerHTML="Next"
                if(istimestarted==0){
                    startTime()
                }
            }else{
                Swal.fire(
                    'Opps...',
                    'Some Thing Went Wrong Please Try After Some Time',
                    'warning'
                  )
            }
        }})
}

function restartGame(){
    nextQuestion.innerHTML="Next"
    timesec=quizTime
    quesionno=0
    correct=0
    wrong=0
    answerd=0
    scorevalue=0
    displayscore.innerHTML=scorevalue
    istimestarted=0
    getQuesAndAns(fetchurl)
}

let trivia_category=document.getElementById("trivia_category")
let trivia_difficulty=document.getElementById("trivia_difficulty")
trivia_category.addEventListener("input",()=>{
    if(trivia_category.value!="any"){
        fetchurl=fetchurl+"&category="+(trivia_category.value)
        getQuesAndAns(fetchurl)  
    }else{
       var trivia_categoryvalue= Math.floor(Math.random() * (32 - 9) + 9);
       fetchurl=fetchurl+"&category="+(trivia_categoryvalue)
        getQuesAndAns(fetchurl)
    }
})


trivia_difficulty.addEventListener("input",()=>{
    if(trivia_difficulty.value!="any"){
        fetchurl=fetchurl+"&difficulty="+(trivia_difficulty.value)
        getQuesAndAns(fetchurl)
    }else{
      let difficultyarray=["easy","medium","hard"]
      let difficulty=difficultyarray[Math.floor(Math.random()*difficultyarray.length)]
      fetchurl=fetchurl+"&difficulty="+(difficulty)
      getQuesAndAns(fetchurl)

    }
})

let timeid;
getQuesAndAns(fetchurl)
function startTime(){
    istimestarted=1
    timeid=setInterval(()=>{
        timesec--
        let min=Math.floor(timesec/60)
        let sec=timesec%60
        if(timesec==-1){
            clearInterval(timeid)
            option1in.disabled=true
            option2in.disabled=true
            option3in.disabled=true
            option4in.disabled=true
            nextQuestion.innerHTML="Restart Quiz"

            
            trivia_difficulty.disabled=true
            trivia_category.disabled=true
            
            if(scorevalue>0){
                Swal.fire(
                    'You Win',
                    `Hay Master You Win This Game<br> Question Attempted : ${answerd} <br> Correct : ${correct} <br> Wrong : ${wrong}`,
                    'success'
                  )
            }else{
                Swal.fire(
                    'You Loss',
                    `Hay Master try Again <br> Question Attempted : ${answerd} <br> Correct : ${correct} <br> Wrong : ${wrong}`,
                    'error'
                  )
            }
           
        }else{

            timeEle.innerHTML=`${min}m : ${sec}s`
        }
        
    },1000)
}
function answerdoption(value){
    option1in.disabled=true
    option2in.disabled=true
    option3in.disabled=true
    option4in.disabled=true
    answerd++
    if(currectvalue==0){
        option1.style.color="#1000ff0"
    }else if(currectvalue==1){
        option2.style.color="#1000ff"
    }else if(currectvalue==2){
        option3.style.color="#1000ff"
    }else{
        option4.style.color="#1000ff"
    }
    if(correctans==value){
        isanscorrect.style.color="#00ff00"
        isanscorrect.innerHTML="Wow Your Answer Is Correct"
        scorevalue++
        correct++
        displayscore.innerHTML=scorevalue
    }else{
        isanscorrect.style.color="red"
        isanscorrect.innerHTML=`Sorry Answer Is Incorrect . The correct answer is ${correctans}`
        scorevalue--
        wrong++
        displayscore.innerHTML=scorevalue
    }
}
option1in.addEventListener("click",()=>{
    answerdoption(option1in.value)
})
option2in.addEventListener("click",()=>{
    answerdoption(option2in.value)
})
option3in.addEventListener("click",()=>{
    answerdoption(option3in.value)
})
option4in.addEventListener("click",()=>{
    answerdoption(option4in.value)
})
function btn(){
    if((nextQuestion.innerHTML).trim()=="Next"){
        getQuesAndAns(fetchurl)
    }else if((nextQuestion.innerHTML).trim()=="Restart Quiz"){
        restartGame()
    }
}
