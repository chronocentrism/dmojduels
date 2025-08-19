particlesJS("particles-js", {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 200, // ← increase this for more connections
            color: "#ffffff",
            opacity: 0.5,
            width: 1
        },
        move: { enable: true, speed: 1, direction: "bottom", out_mode: "out" }
    }
});


// Connection system
// Make user submit to some problem

function showel() {
    // If they clicked and it's already logged in, then log out
    if (localStorage.getItem("handle") !== null) {
        localStorage.clear();
        location.reload();
    } else {
        document.querySelector(".popup").style.display = "initial";
    }
}

function generate() {
    document.querySelector(".submit-text").innerHTML = "Using your account, submit a solution to any problem IN THE LANGUAGE NASM64. Checks automatically every 10 seconds.";
    document.querySelector(".txt-input").disabled = true;
    document.querySelector(".btn-input").disabled = true;

    inty = setInterval(() => {
        // Fetch, if there is a submission, then say successful, if there isn't say unsuccessful
        // Either way, add a button to refresh the page
        
        const username = document.querySelector(".txt-input").value;
        const url = `/proxy/https://dmoj.ca/api/v2/submissions?user=${encodeURIComponent(username)}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                let sub = data.data.objects[data.data.objects.length-1];
                if (sub.language == "NASM64") {
                    document.querySelector(".connected").innerText = username + " [ Click to log out ]";
                    document.querySelector(".popup").style.display = "none";
                    localStorage.setItem("handle", username);
                    clearInterval(inty);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, 10000)
}

window.onload = () => {
    if (localStorage.getItem("handle") !== null) {
        document.querySelector(".connected").innerText = localStorage.getItem("handle") + " [ Click to log out ]";
    }
}