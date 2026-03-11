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
// =========================
//           allGIgs
// =========================
function allGigs() {
    let hidden = JSON.parse(localStorage.getItem("gm_hidden") || "[]");
    let extra = JSON.parse(localStorage.getItem("gm_gigs") || "[]");
    return GIGS.concat(extra).filter(g => !hidden.includes(g.id));
}

// ======== remove gigs===========
function removeGig(id) {
    let hidden = JSON.parse(localStorage.getItem("gm_hidden") || "[]");
    hidden.push(id);
    localStorage.setItem("gm_hidden", JSON.stringify(hidden));
    loadHome();
}

// == show -=

function show(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
  gsap.from("#" + id, { opacity: 0, y: 12, duration: 0.3 });
}


// Quiz
function startQuiz() {
  step = 1;
skills.length = 0; 
time = ""; interests.length = 0;
document.querySelectorAll(".chip").forEach(c => c.classList.remove("on"));
  
["q1","q2","q3"].forEach((id, i) => document.getElementById(id).style.display = i === 0 ? "" : "none");
  refreshQuiz();
  show("quiz");
}

// Home - load gig previews
function startQuiz() {
    step = 1; skills.length = 0; time = ""; interests.length = 0;
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("on"));
    document.querySelectorAll(".opt").forEach(c => c.classList.remove("on"));
    ["q1", "q2", "q3"].forEach((id, i) => document.getElementById(id).style.display = i === 0 ? "" : "none");
    refreshQuiz();
    show("quiz");
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
