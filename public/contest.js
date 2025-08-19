// PARTICLES!!!
particlesJS("particles-js", {
    particles: {
        number: {
            value: 120,
            density: { enable: true, value_area: 800 }
        },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: {
            value: 0.8,
            random: true
        },
        size: {
            value: 4,
            random: true
        },
        move: {
            direction: "bottom",
            speed: 1,
            out_mode: "out"
        },
        line_linked: { enable: false }
    },
    interactivity: {
        events: {
            onhover: { enable: false },
            onclick: { enable: false }
        }
    },
    retina_detect: true
});

// Firstly, you CAN'T ACCESS THIS PAGE IF YOU'RE NOT LOGGED IN
if (localStorage.getItem("handle") === null) {
    alert("Please log in first.")
    window.location.href = "/"
}

// Here are variables for the contest starting and ending time
let contestStart, contestEnd;
let contestStarted = false;

let admins;



// Get this info from the server later in the program
var problems = []
var users = []

var userSolvedCount = {}
var userRatingColor = {}

const params = new URLSearchParams(window.location.search);
const curContestId = params.get('contest');

// custom sort method - sorts dictionary based on size of each table per dictionary entry (biggest = top, smallest = bottom)
function sortDictByTbLn(dict) {
  return Object.entries(dict)

    .sort((a, b) => b[1].length - a[1].length)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
}

// This is like the "Username, P1, P2, P3..." row 
function gethead() {
    const u = document.createElement("div");
    u.classList.add("user");
    u.classList.add("user-first");
    u.innerHTML = `
        <div style="width: 200px">HANDLE</div>
    `

    // Time to get the problems
    for (let i=0; i<problems.length; i++) {
        const el = document.createElement("div");
        el.style = `
            width: 40px;
            height: 40px;
        `
        el.classList.add("spare")
        el.innerText = "P" + (i+1);
        el.onclick = () => window.open(`https://dmoj.ca/problem/${problems[i]}/`, "_blank");

        u.append(el);
    }


    // Then finally add the stuff to the user solved
    document.querySelector(".users").append(u);
}

function displayUsers() {
    document.querySelector(".users").innerHTML = "";
    gethead();

    for (let username in userSolvedCount) {
        const solved = userSolvedCount[username];
        const ratingColor = userRatingColor[username];

        const u = document.createElement("div");
        u.classList.add("user");
        u.innerHTML = `
            <div style="width: 200px; color: ${ratingColor}; font-weight: 700;">${username}</div>
        `

        for (let i=0; i<problems.length; i++) {
            const el = document.createElement("div");
            el.style = `width: 40px; height: 40px;`;
            if (solved.includes(problems[i])) {
                el.classList.add("solved");
            } else {
                el.classList.add("unsolved");
            }
            u.append(el);
        }

        document.querySelector(".users").append(u);
    }
}


function update(idx) {
    if (idx == 0) {
        document.querySelector(".users").innerHTML = "";
        gethead();
    }
    if (idx >= users.length) {
        // Once all users are fetched → sort & display once
        userSolvedCount = sortDictByTbLn(userSolvedCount);
        displayUsers();
        return;
    }

    const username = users[idx];
    const url = `/proxy/https://dmoj.ca/api/v2/user/${username}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const user_problems = data.data.object.solved_problems;
            const ratingColor = getRatingColor(data.data.object.rating);

            userRatingColor[username] = ratingColor;
            userSolvedCount[username] = user_problems.filter(p => problems.includes(p));

            // move on to next user
            update(idx+1);
        })
        .catch(err => {
            console.error(err);
            update(idx+1); // keep going even if one user fails
        });
}


function fetchData() {
    // FETCH FROM SERVER 
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            console.log('Data from server:', data);

            // Find the index of the contest with id curContestId
            let idx = -1;
            for (let i=0; i<data.contests.length; i++) {
                if (data.contests[i].id == curContestId) {
                    idx = i;
                    break;
                }
            }
            problems = data.contests[idx].problems;
            users = data.contests[idx].users;

            admins = data.contests[idx].admins;

            document.querySelector(".contest-admins").innerHTML = "<b>Contest Admins</b>: <i>" + admins + "</i>";
            
            // Also if you're not an admin, DON'T show the admin container
            if (!admins.includes(localStorage.getItem("handle"))) {
                document.querySelector(".admin-container").style.display = "none";
            }

            // Contest starting and ending
            contestStart = new Date(data.contests[idx]["start-time"]);
            contestEnd = new Date(data.contests[idx]["end-time"]);

            update(0);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


function getRatingColor(rating) {
    if (rating == null) {
        return "rgba(255, 255, 255, 1)";
    } else if (0 <= rating && rating < 1000) {
        return "rgba(152, 152, 152, 1)";
    } else if (1000 <= rating && rating <= 1299) {
        return "rgba(0, 255, 0, 1)";
    } else if (1300 <= rating && rating <= 1599) {
        return "rgba(53, 86, 255, 1)";
    } else if (1600 <= rating && rating <= 1899) {
        return "rgba(179, 0, 255, 1)";
    } else if (1900 <= rating && rating <= 2399) {
        return "rgba(225, 255, 0, 1)";
    } else if (2400 <= rating && rating <= 2999) {
        return "rgba(255, 0, 0, 1)";
    } else {
        return "rgba(100, 0, 0, 1)";
    }
}



// TOAST - Little notifications that pop up in the top-right hand corner of the screen
function displayToast(type, text) {
    // Ex. Type="Notice", text="Participant does not exist"
    const toast = document.createElement("div");
    toast.identity = Math.random();
    toast.innerHTML = `
        <div class="toast-type">${type}</div>
        <div class="toast-text">${text}</div>
    `
    toast.style = `
        background: transparent;
        border: 3px solid white;
        border-radius: 10px;
        width: 300px;
        margin: 5px 0;
        padding: 15px;
        padding-bottom: 25px;
        transform: translateX(400px);
        transition: 0.5s ease;
        backdrop-filter: blur(2px);
    `
    const toasts = document.querySelector(".toasts");
    toasts.append(toast);
    
    // Slide in effect
    setTimeout(() => {
        toast.style.transform = "translateX(0)";
    }, 500)

    // Slide out effect
    setTimeout(() => {
        toast.style.transform = "translateX(400px)";
    }, 4500)

    setTimeout(() => {
        toasts.removeChild(toasts.firstElementChild);
    }, 5000)
}


async function validfyInfo(cType,content){
    if(cType == "user"){
        const url = `/proxy/https://dmoj.ca/api/v2/user/${encodeURIComponent(username)}`;
        try {
            const res = await fetch(url);

            if (res.ok) {
                const data = await res.json();
                console.log("User exists:", data.data.object.username);
                return true;
            } else if (res.status === 404) {
                console.log("User not found.");
                return false;
            } else {
                const errData = await res.json().catch(() => null);
                console.error("Error:", errData?.error?.message || res.statusText);
                return false;
            }
        } catch (err) {
            console.error("Network error:", err);
            return false;
        }
    }else if(cType == "problem"){
        const url = `/proxy/https://dmoj.ca/api/v2/problem/${encodeURIComponent(content)}`;
        try {
            const res = await fetch(url);

            if (res.ok) {
                const json = await res.json();
                console.log("Exists! Problem data:", json.data.object);
                return true;
            } else if (res.status === 404) {
                console.log("Problem not found.");
                return false;
            } else {
                const json = await res.json();
                console.error("Error:", json.error?.message || res.statusText);
                return false;
            }
        } catch (err) {
            console.error("Network or other fetch error:", err);
            return false;
        }
    }else{
        return null;
    }
}



// button handling
document.getElementById('add-input-bttn').onclick = () => {
    var prblm_str = document.getElementById('add-input').value
    prblm_str = prblm_str.replace("https://dmoj.ca/problem/","").toLowerCase();

    if (prblm_str == "" || prblm_str == null || validfyInfo("problem",prblm_str) != true){ 
        displayToast("Notice", `Invalid Problem ID / Link.`)
        return;
    }

    const dataToSend = {
        "type":"problem",
        "action":"add",
        "contest_id":curContestId,
        "problem_id":prblm_str
    }

    fetch('/savedata',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    }).then(
        response => {
            console.log(response),
            document.getElementById('add-input').value = ""
            displayToast("Notice", `Successfully added problem ${prblm_str}.`),
            fetchData()
        }
    )
}

document.getElementById('remove-input-bttn').onclick = () => {
    var prblm_str = document.getElementById('remove-input').value
    prblm_str = prblm_str.replace("https://dmoj.ca/problem/","").toLowerCase();

    if (prblm_str == "" || prblm_str == null || validfyInfo("problem",prblm_str) != true){ 
        displayToast("Notice", `Invalid Problem ID / Link.`)
        return;
    }

    const dataToSend = {
        "type":"problem",
        "action":"remove",
        "contest_id":curContestId,
        "problem_id":prblm_str
    }

    fetch('/savedata',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    }).then(
        response => {
            console.log(response),
            document.getElementById('remove-input').value = ""
            displayToast("Notice", `Successfully removed problem ${prblm_str}.`),
            fetchData()
        }
    )

}

document.getElementById('add-participant-bttn').onclick = () => {
    console.log("Button click")
    var user_str = document.getElementById('add-participant').value
    user_str = user_str.replace("https://dmoj.ca/user/","");

    if (user_str == "" || user_str == null || validfyInfo("user",user_str) != true){ 
        displayToast("Notice", `Invalid User ID / Link.`)
        return;
    }

    const dataToSend = {
        "type":"user",
        "action":"add",
        "contest_id":curContestId,
        "name":user_str
    }

    fetch('/savedata',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
         body: JSON.stringify(dataToSend)
    }).then(
        response => {
            console.log(response),
             document.getElementById('add-participant').value = ""
            displayToast("Notice", `Successfully added participant ${user_str}.`),
            fetchData()
        }
    )

}

document.getElementById('remove-participant-bttn').onclick = () => {
    var user_str = document.getElementById('remove-participant').value
    user_str = user_str.replace("https://dmoj.ca/user/","");

    if (user_str == "" || user_str == null || validfyInfo("user",user_str) != true){ 
        displayToast("Notice", `Invalid User ID / Link.`)
        return;
    }
    
    const dataToSend = {
        "type":"user",
        "action":"remove",
        "contest_id":curContestId,
        "name":user_str
    }

    fetch('/savedata',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    }).then(
        response => {
            console.log(response),
            document.getElementById('remove-participant').value = ""
            displayToast("Notice", `Successfully removed participant ${user_str}.`),
            fetchData()
        }
    )
    
}

var update_db = false;
document.querySelector(".standings-button").onclick = () => {
    if (!update_db){
        update_db = true;
        document.querySelector(".standings-button").style.opacity = "0.5"
        displayToast("Notice", "Successfully updated standings.")
        update(0)
        setInterval(() => {
            update_db = false;
            document.querySelector(".standings-button").style.opacity = "1"
        },5000)
    }else{
        displayToast("Notice", `Please wait 5 seconds before updating the standings!`)
    }
}


fetchData();

inty = setInterval(() => {
    fetchData();
}, 65000)









// Time


function timeUntil(curDate) {
    let diff = contestEnd - curDate;
    if (diff <= 0) return { d:0,h:0,m:0,s:0 };
    let d = Math.floor(diff / 864e5);        // days
    let h = Math.floor(diff / 36e5) % 24;    // hours
    let m = Math.floor(diff / 6e4) % 60;     // minutes
    let s = Math.floor(diff / 1e3) % 60;     // seconds
    return { d, h, m, s };
}


// We have to repeatedly update the amount of time left in the contest
inty2 = setInterval(() => {
    if (new Date() < contestStart) {
        document.querySelector(".contest-status").innerText = "Contest starts in:";
        let tmp = timeUntil(contestStart, new Date());
        document.querySelector(".time-remaining").innerText = `${tmp.d}d ${tmp.h}h ${tmp.m}m ${tmp.s}s`
        if (!admins.includes(localStorage.getItem("handle"))) {
            document.querySelector(".container").style.display = "none";
        } else {
            document.querySelector(".container").style.display = "flex";
        }
    } else if (new Date() > contestEnd) {
        document.querySelector(".contest-status").innerText = "Contest Ended!";
        let tmp = timeUntil(contestEnd, new Date());
        document.querySelector(".time-remaining").innerText = `${tmp.d}d ${tmp.h}h ${tmp.m}m ${tmp.s}s`
        document.querySelector(".container").style.display = "flex";
    } else {
        document.querySelector(".contest-status").innerText = "Contest ends in:";
        let tmp = timeUntil(contestEnd, new Date());
        document.querySelector(".time-remaining").innerText = `${tmp.d}d ${tmp.h}h ${tmp.m}m ${tmp.s}s`
        document.querySelector(".container").style.display = "flex";
    }
}, 1000)
