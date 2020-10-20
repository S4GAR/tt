//Welcome to Time Table B2 Project

import {timeTableObj,meetLinks,timing,showVideos} from './config/config.js';
import foo from './js/functions.js';
import DOMfoo from './js/DOMFunctions.js';

//foo is for functions which are returning some values
//DOMfoo is for DOM Manipulation functions

//authuser value used in the meetlink
let authuser = 2;
// TODO: save the value of authuser to cookies

// variable for current week day number
let weekDayNumber = foo.getWeekDayOnlyNumber();

//Funtion to Display/Render timetable to the HTML
function timeTableDisplay(weekDay){

    DOMfoo.DOMReset(logo);
    weekDay = foo.weekDayConverter(weekDay);
    DOMfoo.weekDayDOM(weekDay);

    let todayClasses = timeTableObj[weekDay];

    for(let lectureNumber in todayClasses){

        // Select a mainDivBody element which is 'div.lectures'
        let mainDivBody = document.querySelector('div.lectures');
        // Span Tag for Timing Details Display
        let spanTag = DOMfoo.spanTag(timing[lectureNumber]);
        
        //When there is multiple classes in one given time period
        if(todayClasses[lectureNumber].includes('or')){
            // Creating basePTag for Multiple Class using by appending spanTag of timeing and lecture Number
            let basePTagOfMultipleClass = DOMfoo.basePTagOfMultipleClass(spanTag,lectureNumber);
            // Creating Array of Class in the same time period which are spearated by 'or'
            let theClasses = todayClasses[lectureNumber].split(' or ');
            // Mapping each class with its anchor Tag using Class name, meetlink, authuser
            let aTags = theClasses.map(theClass => DOMfoo.aTagDOM(theClass,meetLinks[theClass],authuser));
            // appendig anchor tag to basePTag
            aTags.forEach(aTag => {
                basePTagOfMultipleClass.append(aTag);
                basePTagOfMultipleClass.append(' OR ');
            })
            // removing last child which is OR
            basePTagOfMultipleClass.removeChild(basePTagOfMultipleClass.lastChild);
            // appending basePTag to the main Div Body
            mainDivBody.appendChild(basePTagOfMultipleClass);
        }
        //When there is only one class in the given time period
        else{
            // Gets the Class name
            let theClass = todayClasses[lectureNumber];
            // Creating Anchor Tag of the Class using Class name, meetlink, authuser
            let aTag;
                //if there is no class
            if(theClass=='No Class'){
                aTag = DOMfoo.aTagDOM(theClass,meetLinks[theClass],'');
            }else{
                aTag = DOMfoo.aTagDOM(theClass,meetLinks[theClass],authuser);
            }
            
            // Creating basePTag in which appending spanTag, Lecture Number, aTag
            let basePTag = DOMfoo.basePTag(aTag,spanTag,lectureNumber);
            // appending basePTag to the main Div Body
            mainDivBody.appendChild(basePTag);
        }
    }

    // TO show videos on the webpage or not, you can set the value in the config/config.js file
    if(showVideos){
        DOMfoo.setVideo();
    }else{
        DOMfoo.videoHide();
    }
}

// Displayes/Render the TimeTable accoring to given week day, here it is current week day
timeTableDisplay(weekDayNumber)

// selecting all authuser 'li' tag
let allAuthuser = document.querySelectorAll('footer ul.authuser li');
// adding event listener to each 'li' tag
allAuthuser.forEach(authUserElement => {
    authUserElement.addEventListener('click', (e)=>{
        // updating the value of authuser
        authuser = parseInt(authUserElement.textContent);
        // Displaying the Timetable with updated value of authuser
        timeTableDisplay(foo.getWeekDayOnlyNumber());
    });
});

// selecting left,right arrow and 'div#weekDay'
let prevButton = document.querySelector('button.left');
let nextButton = document.querySelector('button.right');
let resetDivButton = document.querySelector('header');

//Adding event listener to prevButton (left arrow),
//Decrement the value of weekDayNumber and facilitates the navigation of timetable between days

prevButton.addEventListener('click',(e)=>{
    weekDayNumber--;
    timeTableDisplay(weekDayNumber);
});
    // Previous week day using Left arrow key
document.addEventListener('keyup',(e)=>{
    if(e.code == 'ArrowLeft'){
        weekDayNumber--;
        timeTableDisplay(weekDayNumber)
    }
});

//Adding event listener to nextButton (right arrow)
//Increment the value of weekDayNumber and facilitates the navigation of timetable between days
nextButton.addEventListener('click',(e)=>{
    weekDayNumber++;
    timeTableDisplay(weekDayNumber);
});
    //Next week day using Right arrow key
document.addEventListener('keyup',(e)=>{
    if(e.code == 'ArrowRight'){
        weekDayNumber++;
        timeTableDisplay(weekDayNumber)
    }
});

//Adding event listener to 'div#weekDay' (div where logo is situated)
resetDivButton.addEventListener('click',(e)=>{
    //Reset to the current weekday
    weekDayNumber = foo.getWeekDayOnlyNumber();
    timeTableDisplay(foo.getWeekDayOnlyNumber());
});
    //Reset using up key
document.addEventListener('keyup',(e)=>{
    if(e.code == 'ArrowUp'){
        //Reset to the current weekday
        weekDayNumber = foo.getWeekDayOnlyNumber();
        timeTableDisplay(foo.getWeekDayOnlyNumber());
    }
});

//Adding Event Listener to directly join the meet or open links, And set authuser
document.addEventListener('keyup',(e)=>{
    if(e.code.includes('Digit') || e.code.includes('Numpad')){
        var keyNum = e.code.slice(-1);
        var isNumPad = (e.code.includes('Numpad'))?true:false;
    }else{
        return;
    }

    if(isNumPad){
        authuser=keyNum;
        timeTableDisplay(foo.getWeekDayOnlyNumber());
    }else{
        let theClass = timeTableObj[foo.getWeekDayNameByNumber(weekDayNumber)][keyNum];
        // open link only for while meetLinks exis.
        if(theClass && meetLinks[theClass]!='#'){
            window.open(`${meetLinks[theClass]}${authuser}`, '_blank');
        }
    }
});


//Join Current Class using Space Bar
document.addEventListener('keyup',(e)=>{
    if(e.code == "Space"){
        let time = foo.getCurrentTimeIn24Hour();
        // iterating i from 1 to the length of the timeing[], so to iterate over every class
        for(let i=1; i <timing.length; i++){
            // Checking if the current time is in the class/lecture/period time range or not.
            if(foo.isTimeinTheGivenRange(time,timing[i])){
                // gets the class/lecture/period name according to the current time period range. which can be modify in config.js
                let theClass = timeTableObj[foo.getWeekDayNameByNumber(weekDayNumber)][i];
                // if the link is not '#' it will open the meet link in the new window.
                if(meetLinks[theClass]!="#"){
                    window.open(`${meetLinks[theClass]}${authuser}`, '_blank');
                }
                break;
            }
        }
    }
});

