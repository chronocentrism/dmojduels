// Of course we need... PARTICLEDS!!!
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
            speed: -1,
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

// Firstly, you CAN'T ACCESS THIS PAGE IF YOU'RE NOT LOGGED IN
if (localStorage.getItem("handle") === null) {
    alert("Please log in first.")
    window.location.href = "/"
}




function showCreateContest() {
    document.querySelector(".create-container").style.display = "initial";
}

// Function to create the contest
var creatingContest = false // debounce
async function createContest() {
    if (!creatingContest) {
        creatingContest = true;
        try {
            const name = document.querySelector(".create-contest-name").value;
            const date = document.querySelector(".create-contest-date").value;
            console.log(date);


            const res = await fetch("/getnewcid", { method: "POST" });
            if (!res.ok) throw new Error("Failed to get new ID");
            
            const data = await res.json();
            const id = data.new_id;
            console.log("New contest ID:", id);

            const createRes = await fetch("/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    id: id,
                    status: "upcoming",
                    admins: [localStorage.getItem("handle")],
                    users: [],
                    "start-time": "",
                    "end-time": "",
                    problems: []
                })
            });

            await createRes.json();
            location.reload();
        } catch (err) {
            console.error(err);
            displayToast("Notice", "Failed to create contest");
        } finally {
            creatingContest = false;
        }
    }
}




// Insert the contests

fetch("/data")
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        let contestList = data.contests;
        
        // Now insert them one by one
        for (let i=0; i<contestList.length; i++) {
            let contestName = contestList[i].name;
            let contestId = contestList[i].id;
            let contestStatus = contestList[i].status;

            const el = document.createElement("div");
            el.classList.add("contest");

            el.innerHTML = `
                <span class="left-side">
                    <div class="contest-name">${contestName}</div>
                    <div class="contest-id">ID: ${contestId}</div>
                </span>
                <span class="right-side">
                    <input type="button" value="View" class="button" onclick="window.location.href='contest.html?contest=${contestId}'">
                </span>
            `

            if (contestStatus == "ongoing") {
                document.querySelector(".ongoing").append(el);
            } else if (contestStatus == "upcoming") {
                document.querySelector(".upcoming").append(el);
            } else {
                document.querySelector(".past").append(el);
            }
        }
    })
    .catch(error => {
        console.error("Error fetching data: ", error);
    })