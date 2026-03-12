const GIGS = [
  { id:1,  title:"JEE Notes for Lalpur Kids",         desc:"Tutor 3 students in Physics, 2hrs/week",              pay:"Rs 400/session", skills:["teach","math"],   cat:"education", by:"Rajesh Uncle"    },
  { id:2,  title:"Instagram Captions – Biryani Spot", desc:"Write 5 captions for a Doranda restaurant's Insta",  pay:"Rs 300",         skills:["write","social"], cat:"social",    by:"Foodies Hub"     },
  { id:3,  title:"Menu Page for Chai Stall",          desc:"Simple HTML menu page, mobile-friendly",             pay:"Rs 500",         skills:["code","design"],  cat:"tech",      by:"Chai Baba"       },
  { id:4,  title:"Logo Design for Local Gym",         desc:"2 logo concepts in Canva for a gym in Harmu",        pay:"Rs 600",         skills:["design","social"],cat:"design",   by:"FitZone Ranchi"  },
  { id:5,  title:"Product Reel Editing",              desc:"Edit a 30-sec reel for a clothing store",            pay:"Rs 450",         skills:["video","social"], cat:"social",    by:"Trendy Threads"  },
  { id:6,  title:"Data Entry for NGO",                desc:"Enter 200 survey responses into a spreadsheet",      pay:"Rs 250",         skills:["data","write"],   cat:"admin",     by:"Jharkhand NGO"   },
  { id:7,  title:"Landing Page for Local Startup",    desc:"Build a one-page site for a Ranchi startup",        pay:"Rs 1200",        skills:["code","design"],  cat:"tech",      by:"TechRanchi"      },
  { id:8,  title:"English Essay Polishing",           desc:"Proofread 3 college essays",                        pay:"Rs 350",         skills:["write","teach"],  cat:"education", by:"Priya Sharma"    },
  { id:9,  title:"WhatsApp Broadcast Content",        desc:"Write 10 short messages for a coaching center",     pay:"Rs 200",         skills:["write","social"], cat:"social",    by:"Toppers Academy" },
  { id:10, title:"Python Script – Shop Inventory",    desc:"Track stock and alert on low items",                pay:"Rs 800",         skills:["code","data"],    cat:"tech",      by:"Sharma Kirana"   },
];

let step = 1, skills = [], time = "", interests = [];

function allGigs() {
  let hidden = JSON.parse(localStorage.getItem("gm_hidden") || "[]");
  let extra  = JSON.parse(localStorage.getItem("gm_gigs")   || "[]");
  return GIGS.concat(extra).filter(g => !hidden.includes(g.id));
}

function removeGig(id) {
  let hidden = JSON.parse(localStorage.getItem("gm_hidden") || "[]");
  hidden.push(id);
  localStorage.setItem("gm_hidden", JSON.stringify(hidden));
  loadHome();
}

function show(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
  gsap.from("#" + id, { opacity: 0, y: 12, duration: 0.3 });
}

// Home - load gig previews
function loadHome() {
  document.getElementById("home-gigs").innerHTML = allGigs().slice(0, 3).map(g =>
    `<div class="gig-card">
      <div><div style="font-weight:600">${g.title}</div><div class="gig-by">by ${g.by}</div></div>
      <div class="d-flex align-items-center gap-2">
        <div class="gig-pay">${g.pay}</div>
        <button class="done-btn" onclick="removeGig(${g.id})" title="Mark as done">✓ Done</button>
      </div>
    </div>`
  ).join("");
}

// Quiz
function startQuiz() {
  step = 1; skills.length = 0; time = ""; interests.length = 0;
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("on"));
  document.querySelectorAll(".opt").forEach(c => c.classList.remove("on"));
  ["q1","q2","q3"].forEach((id, i) => document.getElementById(id).style.display = i === 0 ? "" : "none");
  refreshQuiz();
  show("quiz");
}

function refreshQuiz() {
  document.getElementById("qbar").style.width = (step / 3 * 100) + "%";
  document.getElementById("qlabel").textContent = "Step " + step + " of 3";
  document.getElementById("qback").style.visibility = step > 1 ? "visible" : "hidden";
  document.getElementById("qnext").textContent = step === 3 ? "See Matches ✦" : "Continue →";
  let ok = (step===1 && skills.length) || (step===2 && time) || (step===3 && interests.length);
  document.getElementById("qnext").disabled = !ok;
}

function chips(groupId, arr) {
  document.querySelectorAll("#" + groupId + " .chip").forEach(c => {
    c.onclick = () => {
      c.classList.toggle("on");
      let v = c.dataset.v;
      c.classList.contains("on") ? arr.push(v) : arr.splice(arr.indexOf(v), 1);
      refreshQuiz();
    };
  });
}

function pickTime(el) {
  document.querySelectorAll(".opt").forEach(o => o.classList.remove("on"));
  el.classList.add("on");
  time = el.dataset.v;
  refreshQuiz();
}

function next() {
  if (step < 3) {
    document.getElementById("q" + step).style.display = "none";
    step++;
    document.getElementById("q" + step).style.display = "";
    refreshQuiz();
  } else showMatches();
}

function back() {
  document.getElementById("q" + step).style.display = "none";
  step--;
  document.getElementById("q" + step).style.display = "";
  refreshQuiz();
}

// Results
function score(g) {
  let s = Math.min(g.skills.filter(x => skills.includes(x)).length * 3, 6);
  if (interests.includes(g.cat)) s += 2;
  if (time === "10+") s += 1;
  return Math.min(s, 10);
}

function showMatches() {
  let sorted = allGigs().map(g => ({...g, s: score(g)})).sort((a,b) => b.s - a.s).slice(0, 5);
  document.getElementById("rmeta").textContent = "(top " + sorted.length + ")";

  // Earning estimate
  let earn = { "2-5": "₹500 – 1,200", "5-10": "₹1,200 – 3,000", "10+": "₹3,000 – 6,000" };
  document.getElementById("earn-banner").innerHTML =
    `💰 Based on your availability, you could earn <strong>${earn[time]}/month</strong> from gigs in Ranchi.`;
  document.getElementById("earn-banner").style.display = "";

  document.getElementById("rlist").innerHTML = sorted.map(g => {
    let cls = g.s >= 7 ? "rg" : g.s >= 4 ? "rp" : "rd";
    let tags = g.skills.map(s => `<span class="badge bg-secondary me-1">${s}</span>`).join("");
    let wa = encodeURIComponent(`Hi! Saw "${g.title}" on GigMatch. I'm a student from Ranchi!`);

    // Why matched
    let reasons = [];
    g.skills.forEach(s => { if (skills.includes(s)) reasons.push("✓ " + s); });
    if (interests.includes(g.cat)) reasons.push("✓ " + g.cat + " interest");
    let whyHtml = reasons.length ? `<div class="why-matched mt-1 mb-2">${reasons.join(" &nbsp; ")}</div>` : "";

    return `<div class="result-card">
      <div class="ring ${cls}">${g.s}/10</div>
      <div>
        <div style="font-weight:700">${g.title}</div>
        <div class="text-muted small mb-1">${g.desc}</div>
        ${whyHtml}
        ${tags}
        <div class="d-flex justify-content-between align-items-center mt-2 flex-wrap gap-1">
          <span class="rpay">${g.pay} <span class="text-muted fw-normal small">· ${g.by}</span></span>
          <a href="https://wa.me/?text=${wa}" target="_blank" class="wa">💬 Apply</a>
        </div>
      </div>
    </div>`;
  }).join("");
  show("results");
  gsap.from(".result-card", { opacity: 0, y: 16, stagger: 0.08 });
}

// Share My Skills — student broadcasts their profile to college WhatsApp groups
function shareSkills() {
  let skillLine = skills.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ");
  let intLine   = interests.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ");
  let timeMap   = { "2-5": "2–5 hrs/week", "5-10": "5–10 hrs/week", "10+": "10+ hrs/week" };
  let msg = `🎯 Looking for gig work in Ranchi!

💼 Skills: ${skillLine}
👀 Interests: ${intLine}
⏰ Available: ${timeMap[time]}

DM me or reply here! Found via GigMatch 🚀`;
  window.open("https://wa.me/?text=" + encodeURIComponent(msg), "_blank");
}


// Post gig
function submitGig() {
  let t = document.getElementById("pt").value.trim();
  let d = document.getElementById("pd").value.trim();
  let p = document.getElementById("pp").value.trim();
  let c = document.getElementById("pc").value;
  let n = document.getElementById("pn").value.trim();
  if (!t || !d || !p || !c || !n) {
    document.getElementById("perr").textContent = "Fill all required fields.";
    document.getElementById("perr").style.display = "";
    return;
  }
  let sk = [...document.querySelectorAll("#pchips .chip.on")].map(x => x.dataset.v);
  let extra = JSON.parse(localStorage.getItem("gm_gigs") || "[]");
  extra.push({ id: Date.now(), title:t, desc:d, pay:p, skills:sk, cat:c, by:n });
  localStorage.setItem("gm_gigs", JSON.stringify(extra));
  loadHome();
  document.getElementById("pform").style.display = "none";
  document.getElementById("pok").style.display = "";
  setTimeout(() => {
    document.getElementById("pok").style.display = "none";
    document.getElementById("pform").style.display = "";
    document.getElementById("perr").style.display = "none";
    ["pt","pd","pp","pn"].forEach(id => document.getElementById(id).value = "");
    document.getElementById("pc").value = "";
    document.querySelectorAll("#pchips .chip").forEach(c => c.classList.remove("on"));
    show("home");
  }, 2000);
}

window.onload = () => {
  loadHome();
  chips("skill-chips", skills);
  chips("int-chips", interests);
};