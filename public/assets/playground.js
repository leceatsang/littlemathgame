let option1 = localStorage.getItem("digit1");
let option2 = localStorage.getItem("digit2");
let option3 = localStorage.getItem("seconds");
let option4 = localStorage.getItem("caculation");

document.getElementById("symbol").innerHTML = option4;
let correct_num = 0;

let input = document.querySelector("#input");
input.focus();
input.select();

function num_update() {
    let num1 = Math.floor(Math.random() * Math.pow(10, parseInt(option1)));
    let num2 = Math.floor(Math.random() * Math.pow(10, parseInt(option2)));
    if ((option4 == '/') && (num1 % num2 != 0)) {
        num_update();
    } else {   
        document.getElementById("num1").innerHTML = num1;
        document.getElementById("num2").innerHTML = num2;
    }
}    

function result_return() {
    let correct_answer;
    let input_number = input.value;
    let num1 = document.querySelector("#num1").innerHTML;
    let num2 = document.querySelector("#num2").innerHTML;

    if (option4 == "+") {
        correct_answer = parseInt(num1) + parseInt(num2);
    }
    else if (option4 == "-") {
        correct_answer = parseInt(num1) - parseInt(num2);
    }
    else if (option4 == "x") {
        correct_answer = parseInt(num1) * parseInt(num2);
    }
    else if (option4 == "/") {
        correct_answer = parseInt(num1) / parseInt(num2);
    }

    if (input_number == correct_answer) {
        correct_num++;
        document.getElementById("result_display").innerHTML = '<i id="correct_result" class="fa-solid fa-check fa-4x fa-beat"></i>';
        setTimeout(function(){
            input.value = "";
            document.getElementById("result_display").innerHTML = "";
            num_update();
        }, 300);
    } else {
        document.getElementById("result_display").innerHTML = '<i id="wrong_result" class="fa-solid fa-xmark fa-4x fa-shake"></i>';
        setTimeout(function(){
            input.value = "";
            document.getElementById("result_display").innerHTML = "";
        }, 300);
    }
}

num_update();

let submit = document.querySelector("#submit");
let result = document.querySelector("#result");
let input_num = document.querySelector("#input");
let radio_first_digit = document.querySelector("#first_digit");
let radio_second_digit = document.querySelector("#second_digit");

submit.addEventListener("click", function() {
    result_return();
});

input_num.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        result_return();
    }
});

async function fetch_firebase_for_update_result() {
    let data = {
        'first_num': option1,
        'second_num': option2,
        'time': option3,
        'calculator': option4,
        'result': correct_num,
        'nickname': localStorage.getItem("nickname")
    }

    return await fetch("https://insert-result-4w6sudjkaq-de.a.run.app", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Success:", data['result']);
        if (data['result'] == 'ok') {
            console.log('inserted success', JSON.stringify(data));
            return 1
        } else {
            console.log('something goes wrong');
            return 0
        }
    }).catch((error) => {
        console.log("Error: ", error);
        return 0
    });
};

let clock = parseInt(option3);
let original_seconds = parseInt(option3);

let interval_id = setInterval(function(){
    clock--;
    document.getElementById("timebar").innerHTML = clock + "s";
    document.getElementById("timebar").style = "width: "+ (clock/original_seconds*100) + "%;";
    document.getElementById("timebar").ariaValueNow = clock;

    if(clock === 0) {
        clearInterval(interval_id);
        fetch_firebase_for_update_result();
        Swal.fire({
            'icon': 'success',
            'title': 'Result',
            'text': 'You Got ' + correct_num + ' Point!',
            'confirmButtonText': 'Again!',
            'showCancelButton': true,
            'cancelButtonText': 'Back To Home',
            'allowEnterKey': false
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload();
            } else if (result.isDismissed) {
                location.href = "index.html";
            }
        })
    }
},1000);

