const levels = [
  { title: "True and False", label: "Lesson 1 · the basics", intro: "Python can answer yes-or-no questions with two special values: True and False. Try changing the value below and notice how the answer changes.", code: "is_raining = <span class='value'>True</span>\nprint(is_raining)  <span class='concept'># Python shows True</span>", controls: [{ key:"A", text:"is_raining" }], op:"identity", challenge: { question:"If is_raining is False, what will Python print?", answers:["True", "False"], correct:1, success:"Yes! The variable simply stores the answer: False." } },
  { title: "AND means both", label: "Lesson 2 · both are needed", intro: "Use and when both things need to be true. Think of it like a door: you need a ticket AND to be old enough before you can enter.", code: "has_ticket = <span class='value'>True</span>\nis_old_enough = <span class='value'>True</span>\ncan_enter = has_ticket <span class='syntax'>and</span> is_old_enough", controls: [{key:"A",text:"has_ticket"},{key:"B",text:"is_old_enough"}], op:"and", challenge: { question:"A visitor has a ticket, but is not old enough. Can they enter?", answers:["True", "False"], correct:1, success:"Correct. With AND, every condition has to be True." } },
  { title: "OR means either", label: "Lesson 3 · one is enough", intro: "Use or when one true answer is enough. You can sleep in if it is a weekend OR a holiday—either one gives you permission.", code: "is_weekend = <span class='value'>False</span>\nis_holiday = <span class='value'>True</span>\ncan_sleep_in = is_weekend <span class='syntax'>or</span> is_holiday", controls: [{key:"A",text:"is_weekend"},{key:"B",text:"is_holiday"}], op:"or", challenge: { question:"It is not the weekend and not a holiday. Can you sleep in?", answers:["True", "False"], correct:1, success:"Exactly. OR needs at least one True answer." } },
  { title: "NOT flips the answer", label: "Lesson 4 · turn it around", intro: "Use not to flip an answer. If someone is logged in, then not logged in is False. It is a quick way to check when something is missing.", code: "is_logged_in = <span class='value'>True</span>\nshow_sign_in = <span class='syntax'>not</span> is_logged_in", controls: [{key:"A",text:"is_logged_in"}], op:"not", challenge: { question:"If is_logged_in is True, what is not is_logged_in?", answers:["True", "False"], correct:1, success:"Nice work. NOT always flips True to False, and False to True." } }
];

const storeKey = "logic-lab-complete";
let completed = new Set(JSON.parse(localStorage.getItem(storeKey) || "[]"));
const list = document.querySelector("#level-list");

function calculate(op, values) { if (op === "and") return values.A && values.B; if (op === "or") return values.A || values.B; if (op === "not") return !values.A; return values.A; }
function saveProgress() { localStorage.setItem(storeKey, JSON.stringify([...completed])); updateProgress(); }
function updateProgress() { const number = completed.size; document.querySelector("#progress-text").textContent = `${number} / ${levels.length} lessons`; document.querySelector("#progress-caption").textContent = number === levels.length ? "You finished every lesson—great work!" : number ? `${number} lesson${number > 1 ? "s" : ""} done. You are doing great.` : "Begin with lesson 1."; }
function render() {
  levels.forEach((level, index) => {
    const fragment = document.querySelector("#level-template").content.cloneNode(true);
    const card = fragment.querySelector(".level-card"); const body = fragment.querySelector(".level-body");
    card.dataset.index = index; card.classList.toggle("complete", completed.has(index));
    fragment.querySelector(".level-number").textContent = String(index + 1).padStart(2, "0");
    fragment.querySelector(".level-label").textContent = level.label; fragment.querySelector(".level-title").textContent = level.title;
    fragment.querySelector(".level-status").textContent = completed.has(index) ? "Complete ✓" : index === 0 || completed.has(index - 1) ? "Ready" : "Locked";
    const locked = index > 0 && !completed.has(index - 1); if (locked) card.classList.add("locked");
    body.innerHTML = `<p class="lesson-intro">${level.intro}</p><div class="code-panel">${level.code}</div><div class="lab"><div class="lab-heading"><strong>Try it yourself</strong><span>click a value to change it</span></div><div class="switches"></div><div class="result-panel"><span>Python's answer →</span><span class="truth-pill"></span></div></div><div class="challenge"><h4>One quick question</h4><p>${level.challenge.question}</p><div class="answer-options"></div><p class="feedback"></p></div>`;
    const summary = fragment.querySelector(".level-summary"); summary.disabled = locked; summary.setAttribute("aria-disabled", locked);
    if (locked) summary.title = "Complete the previous level first";
    summary.addEventListener("click", () => { card.classList.toggle("open"); summary.setAttribute("aria-expanded", card.classList.contains("open")); });
    const values = Object.fromEntries(level.controls.map(c => [c.key, true])); const switches = body.querySelector(".switches"); const pill = body.querySelector(".truth-pill");
    function refreshLab() { const outcome = calculate(level.op, values); pill.textContent = outcome ? "True" : "False"; pill.className = `truth-pill ${outcome ? "true" : "false"}`; switches.querySelectorAll("button").forEach(button => { const on = values[button.dataset.key]; button.textContent = `${button.dataset.name} = ${on ? "True" : "False"}`; button.classList.toggle("active-true", on); }); }
    level.controls.forEach(control => { const button = document.createElement("button"); button.type = "button"; button.className = "value-switch"; button.dataset.key = control.key; button.dataset.name = control.text; button.addEventListener("click", () => { values[control.key] = !values[control.key]; refreshLab(); }); switches.append(button); }); refreshLab();
    const feedback = body.querySelector(".feedback"); level.challenge.answers.forEach((answer, answerIndex) => { const button = document.createElement("button"); button.type = "button"; button.className = "answer"; button.textContent = answer; button.addEventListener("click", () => { if (answerIndex === level.challenge.correct) { body.querySelectorAll(".answer").forEach(b => b.disabled = true); button.classList.add("correct"); feedback.textContent = level.challenge.success; completed.add(index); saveProgress(); card.classList.add("complete"); card.querySelector(".level-status").textContent = "Complete ✓"; card.querySelector(".level-number").textContent = "✓";
      const nextCard = list.querySelector(`[data-index="${index + 1}"]`);
      if (nextCard) { const nextSummary = nextCard.querySelector(".level-summary"); nextCard.classList.remove("locked"); nextSummary.disabled = false; nextSummary.removeAttribute("title"); nextSummary.setAttribute("aria-disabled", "false"); nextCard.querySelector(".level-status").textContent = "Ready"; }
    } else { button.classList.add("wrong"); feedback.textContent = "Not quite—try the expression one value at a time."; } }); body.querySelector(".answer-options").append(button); });
    list.append(fragment);
  }); updateProgress();
}
document.querySelector("#reset-button").addEventListener("click", () => { completed.clear(); saveProgress(); list.innerHTML = ""; render(); });
render();
