const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copybtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator");
const resetbtn=document.querySelector(".resetbtn");

const generateBtn=document.querySelector(".generatebtn");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~@#$%^&*()=+][}{":;/?><.,*';
// console.log(allCheckBox);

let password="";
let passwordLength=10;
let checkCount=0;

handleSlider();
//set passwordLength
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
}
setIndicator('gray');

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
//shadow
}

function getRndInteger(min,max){
    return Math.floor( Math.random() * ( max - min) + min);
    //return value between min and max 
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}


function generateLowerCase(){
    //string.fromCharCode function used to get ASCII value of random small letter
    return  String.fromCharCode(getRndInteger(97,123))
}

function generteUpperCase(){
    //A-Z 65-91 (ASCII Value)
    //a-z 97-123 (ASCII Value)

    return  String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol(){
    const randNum= getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum   = false;
    let hasSym   = false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked)   hasNum=true;
    if(symbolsCheck.checked)   hasSym=true;

    //check if password is strong or not

    if(hasUpper && hasLower && ( hasNum || hasSym) && passwordLength>=8  ){
        setIndicator('green');
    }
    else if(
        (hasLower || hasUpper)&&
        (hasNum || hasSym)&&
        passwordLength>=6
    )
    {
        setIndicator('red');
    }
    else{
        setIndicator('gray');
    }
}
async function copycontent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
    }
    catch{
        copyMsg.innerText='failed';
    }

    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( ()=>{
        copyMsg.classList.remove("active");
        }
        ,2000);
}

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});

copybtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copycontent();
    }

})


function handleCheckboxChange(){
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
        else{
            checkCount--;
        }
    });

    //special condition

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider(); 
    }
   
};


//shuffling alogrithm 

function shufflepassword(array)
{
    for (let i=array.length-1; i > 0; i--){
        const j=Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str="";
    array.forEach((el) => (str += el));
    return str;
}

allCheckBox.forEach( checkbox => {

    checkbox.addEventListener("change",handleCheckboxChange);
});

//final generate password button press
generateBtn.addEventListener("click",()=>{
    //if all checkbox are unchecked
    if(checkCount ==0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //password empty
    password="";

    //let's put all stuff into password display

    // if(uppercaseCheck.checked){
    //     password+=generteUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numberCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }

    let funcArr=[];
    
    if(uppercaseCheck.checked)
        funcArr.push(generteUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numberCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);
   
        
    //complusory  addition
    console.log(funcArr.length);

    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    console.log("after complusory password",password);
    //remaing password addtion

    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex  = getRndInteger(0, funcArr.length);
        password+=funcArr[randIndex]();

    }
    console.log("after remiang password",password);


    //shuffling the password

    // password = shufflepassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;
    // console.log(password);
    //show strength 

    calcStrength();
}
);


resetbtn.addEventListener('click',reset);
function reset(){
    passwordDisplay.value="";
}