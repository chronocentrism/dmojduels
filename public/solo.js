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