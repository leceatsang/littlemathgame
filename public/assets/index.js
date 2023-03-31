async function fetch_firebase_user_history(nickname) {
    console.log(nickname);
    if ((nickname == undefined) || (nickname == '') || (nickname == null)) {
        document.getElementById('history_loader').style = 'display: none';
        return
    }

    return await fetch("https://return-user-recent-result-4w6sudjkaq-de.a.run.app", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            'nickname': nickname
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        document.getElementById('history_loader').style = 'display: none';
        if (data['result'].length !=0) {
            let result = ''
            let table_body = document.getElementById("user_history_table_body");
            for (let i=0; i <= data['result'].length; i++) {
                result = data['result'][i];
                if ((result !== undefined) && (result['calculator'] !== undefined) && (result['result'] !== undefined) ) {
                    table_row = table_body.insertRow();
                    table_row.innerHTML = '<th scope="row">'+ result['first_num'] + 'D ' + result['calculator']  + ' ' + result['second_num'] + 'D</td>'
                    + '<td>'+ result['time'] +'s</td>'
                    + '<td>'+ result['result'] +'</td>'
                }
            }
        }
    }).catch((error) => {
        console.log("Error: ", error);
        return 0
    });
}

async function fetch_firebase_for_nickname(input_nickname) {
    return await fetch("https://create-user-4w6sudjkaq-de.a.run.app", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            'nickname': input_nickname
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Success:", data['result']);
        if (data['result'] == 'ok') {
            console.log('OK', input_nickname);
            localStorage.setItem("nickname", input_nickname);
            document.getElementById('nickname_warning_block').innerHTML = '';
            return 1
        } else if (data['result'] == 'user found') {
            document.getElementById('nickname_warning_block').innerHTML = 'Duplicated Nickname Found. Please input other nickname';
            return 0
        } else {
            document.getElementById('nickname_warning_block').innerHTML = 'Please input nickname';
            return 0
        }
    }).catch((error) => {
        console.log("Error: ", error);
        return 0
    });
};

// default nickname set from localstorage if any
nickname = localStorage.getItem('nickname');
if (nickname != '') {
    fetch_firebase_user_history(nickname)
    document.getElementById('input_nickname').value = nickname
}

let start_button = document.getElementById("start_button");
start_button.addEventListener("click", async function() {
    let input_nickname = document.getElementById("input_nickname").value;
    // console.log(localStorage.getItem("nickname"));
    if (localStorage.getItem("nickname") != input_nickname) {
        if (await fetch_firebase_for_nickname(input_nickname) == 0) {
            return;
        }
    }

    let element;
    let digit1 = document.getElementsByName("digit1");

    for (let i = 0; i < digit1.length; i++ ) {
        element = digit1[i];

        if ( element.checked == true) {
            localStorage.setItem("digit1",element.value);
        }
    }
    let digit2 = document.getElementsByName("digit2");
    for (let i = 0; i < digit2.length; i++ ) {
        element = digit2[i];

        if ( element.checked == true) {
            localStorage.setItem("digit2",element.value);
        }
    }
    let seconds = document.getElementsByName("seconds");
    for (let i = 0; i < seconds.length; i++ ) {
        element = seconds[i];

        if ( element.checked == true) {
            localStorage.setItem("seconds",element.value);
        }
    }
    let caculation = document.getElementsByName("caculation");
    for (let i = 0; i < caculation.length; i++ ) {
        element = caculation[i];

        if ( element.checked ) {
            localStorage.setItem("caculation",element.value);
        }
    }

    location.href = "playground.html";
});


let first_num_input_elements = document.getElementsByClassName("input_first_num_setting");
for (var i = 0; i < first_num_input_elements.length; i++) {
    first_num_input_elements[i].addEventListener('click', function(e) {
        sample_value = 1;
        if (e.target.value == 1) {
            sample_value = 1;
        }
        if (e.target.value == 2) {
            sample_value = 11;
        }
        if (e.target.value == 3) {
            sample_value = 111;
        }
        if (e.target.value == 4) {
            sample_value = 1111;
        }

        document.getElementById('sample_first_number').innerHTML = sample_value;
    });
}

let second_num_input_elements = document.getElementsByClassName("input_second_num_setting");
for (var i = 0; i < second_num_input_elements.length; i++) {
    second_num_input_elements[i].addEventListener('click', function(e) {
        sample_value = 1;
        if (e.target.value == 1) {
            sample_value = 1;
        }
        if (e.target.value == 2) {
            sample_value = 11;
        }
        if (e.target.value == 3) {
            sample_value = 111;
        }
        if (e.target.value == 4) {
            sample_value = 1111;
        }

        document.getElementById('sample_second_number').innerHTML = sample_value;
    });
}


let input_calculator_setting_elements = document.getElementsByClassName("input_calculator_setting");
for (var i = 0; i < input_calculator_setting_elements.length; i++) {
    input_calculator_setting_elements[i].addEventListener('click', function(e) {
        document.getElementById('sample_calculator').innerHTML = e.target.value;
    });
}
