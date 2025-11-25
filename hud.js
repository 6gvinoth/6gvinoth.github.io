// hud.js — attaches HUD overlay to .hero
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const hud = document.createElement("div");
  hud.className = "hud";

  hud.innerHTML = `
    <div class="grid"></div>
    <div class="hud-ring"></div>
    <div class="hud-ring small" style="border-color:rgba(0,234,255,0.18)"></div>
    <div class="scan-line"></div>
  `;

  hero.appendChild(hud);

  // small reactive pulse when arc-button is clicked
  const arc = hero.querySelector(".arc-button");
  if (arc) {
    arc.addEventListener("click", () => {
      hud.style.transition = "filter 260ms ease";
      hud.style.filter = "brightness(1.6) saturate(1.2)";
      setTimeout(() => { hud.style.filter = ""; }, 300);
      // pulse ring scale
      const rings = hud.querySelectorAll(".hud-ring");
      rings.forEach(r => {
        r.animate([
          { transform: r.style.transform || "translate(-50%, -50%) scale(1)" },
          { transform: "translate(-50%, -50%) scale(1.06)" },
          { transform: r.style.transform || "translate(-50%, -50%) scale(1)" }
        ], { duration: 420, easing: "ease-out" });
      });
    });
  }
});


