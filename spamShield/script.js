const messageInput = document.getElementById("message-input");
const checkBtn = document.getElementById("check-message-btn");
const resultBox = document.getElementById("result");
const riskLevel = document.getElementById("risk-level");
const scoreText = document.getElementById("score");
const triggersList = document.getElementById("triggers");
const meterFill = document.getElementById("meter-fill");
const historyList = document.getElementById("history-list");
const themeToggle = document.getElementById("theme-toggle");

const helpRegex = /please help|assist me/i;
const dollarRegex = /[0-9]+\s*(?:hundred|thousand|million|billion)?\s+dollars/i;
const freeRegex = /(?:^|\s)fr[e3][e3] m[o0]n[e3]y(?:$|\s)/i;
const stockRegex = /(?:^|\s)[s5][t7][o0][c{[(]k [a@4]l[e3]r[t7]/i;
const dearRegex = /dear friend/i;

const urlRegex = /(https?:\/\/|www\.)/i;
const urgencyRegex = /urgent|act now|limited time/i;
const cryptoRegex = /bitcoin|crypto|wallet/i;

const rules = [
  { regex: helpRegex, score: 20, label: "Begging / urgency phrase" },
  { regex: dollarRegex, score: 30, label: "Money bait" },
  { regex: freeRegex, score: 25, label: "Free money scam" },
  { regex: stockRegex, score: 25, label: "Investment lure" },
  { regex: dearRegex, score: 15, label: "Classic scam greeting" },
  { regex: urlRegex, score: 20, label: "Contains suspicious link" },
  { regex: urgencyRegex, score: 15, label: "Urgency pressure tactic" },
  { regex: cryptoRegex, score: 20, label: "Crypto-related scam" }
];

messageInput.addEventListener("input", liveScan);
checkBtn.addEventListener("click", runScan);
themeToggle.addEventListener("click", toggleTheme);

loadHistory();

function runScan() {
  const msg = messageInput.value.trim();
  if (!msg) return alert("Enter a message.");

  const { score, triggers } = analyze(msg);
  displayResult(score, triggers);
  saveHistory(msg, score);
}

function liveScan() {
  const msg = messageInput.value.trim();
  if (!msg) {
    resultBox.classList.add("hidden");
    return;
  }

  const { score, triggers } = analyze(msg);
  displayResult(score, triggers);
}

function analyze(msg) {
  let score = 0;
  const triggers = [];

  rules.forEach(rule => {
    if (rule.regex.test(msg)) {
      score += rule.score;
      triggers.push(rule.label);
    }
  });

  return { score, triggers };
}

function displayResult(score, triggers) {
  resultBox.classList.remove("hidden");
  triggersList.innerHTML = "";

  scoreText.textContent = `Spam Score: ${score}`;
  meterFill.style.width = `${Math.min(score, 100)}%`;

  if (score >= 50) {
    riskLevel.textContent = "⚠ High Risk Spam";
    meterFill.style.background = "#f87171";
  } else if (score >= 25) {
    riskLevel.textContent = "🤔 Suspicious";
    meterFill.style.background = "#facc15";
  } else {
    riskLevel.textContent = "✅ Looks Safe";
    meterFill.style.background = "#4ade80";
  }

  triggers.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    triggersList.appendChild(li);
  });
}

function saveHistory(msg, score) {
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  history.unshift({ msg, score });
  localStorage.setItem("history", JSON.stringify(history.slice(0, 5)));
  loadHistory();
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  historyList.innerHTML = "";

  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.score} → ${item.msg}`;
    historyList.appendChild(li);
  });
}

function toggleTheme() {
  document.body.classList.toggle("light");
  themeToggle.textContent =
    document.body.classList.contains("light") ? "☀️" : "🌙";
}
