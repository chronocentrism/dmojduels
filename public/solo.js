// PARTICLES

particlesJS("particles-js", {
    particles: {
    number: { value: 60, density: { enable: true, value_area: 800 } },
    color: { value: "#00bfff" }, // light blue
    shape: { type: "circle" },
    opacity: {
        value: 0.6,
        random: true,
        anim: { enable: true, speed: 1, opacity_min: 0.2 }
    },
    size: {
        value: 8,
        random: true,
        anim: { enable: true, speed: 4, size_min: 2 }
    },
    move: {
        enable: true,
        speed: 2,
        direction: "top",   // makes them float upward
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false
    }
    },
    interactivity: {
    detect_on: "canvas",
    events: {
        onhover: { enable: true, mode: "bubble" },
        onclick: { enable: true, mode: "repulse" },
        resize: true
    },
    modes: {
        bubble: { distance: 200, size: 12, duration: 2, opacity: 0.8 },
        repulse: { distance: 150, duration: 0.4 }
    }
    },
    retina_detect: true
});

/*

async function addContest() {
    // const createRes = await fetch("/create", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //         name: name,
    //         //id: id, <= Added in server.js
    //         status: "upcoming",
    //         admins: ["Solo Contest"],
    //         users: [],
    //         "start-time": combined,
    //         "end-time": endFormatted,
    //         problems: []
    //     })
    // });

    // await createRes.json();
    // location.reload();
}

function createContest(dist) {
    // First get random problems from the distribution
    // Get all problems from DMOJ API
    // https://dmoj.ca/api/v2/problems?point_start=3&point_end=3

    let lis = dist.split("-").map(num => Number(num));
    console.log(lis);
    problems = [];

    const proxy = 'http://localhost:6969/';
    let wait = 0;
    for (let x of lis) {
        wait++;
        setTimeout(() => {
            const url = `https://dmoj.ca/api/v2/problems?point_start=${x}&point_end=${x}`;
            console.log(x + " " + url);
            fetch(proxy + url, {
                "Authorization": `Bearer ${"AAMO10ofrHihDShFdo5v1UxIdUTY_yLZCKWqr2wSHEiJFx6f"}`
            })
                .then(async res => await res.json())
                .then(data => {
                    console.log(data);
                    // fetched_problems = 
                })
                .catch(err => {
                    console.error(err);
                    console.log(proxy + url);
                });
        }, wait*500)
        
    }
    
    // addContest();
}

function setDifficulty(d) {
    if (d == 1) {
        localStorage.setItem("distribution", "3-5-5-7-10");
    } else if (d == 2) {
        localStorage.setItem("distribution", "5-7-10-15-17");
    } else if (d == 3) {
        localStorage.setItem("distribution", "3-3-3-5-5");
    } else if (d == 4) {
        localStorage.setItem("distribution", "3-3-5-5-7");
    } else if (d == 5) {
        localStorage.setItem("distribution", "3-5-5-7-10");
    } else if (d == 6) {
        localStorage.setItem("distribution", "5-7-7-10-10");
    } else if (d == 7) {
        localStorage.setItem("distribution", "7-7-10-10-12");
    } else if (d == 8) {
        localStorage.setItem("distribution", "7-10-10-12-15");
    } else if (d == 9) {
        localStorage.setItem("distribution", "10-12-12-15-15");
    } else if (d == 10) {
        localStorage.setItem("distribution", "10-12-15-15-17");
    }

    createContest(localStorage.getItem("distribution"));
}
    */