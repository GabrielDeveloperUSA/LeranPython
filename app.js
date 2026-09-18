const levels = [
  { title: "Truth values", label: "Level 1 · foundation", intro: "Every logical expression eventually becomes one of two Boolean values: True or False. Start by seeing a value change live.", code: "is_raining = <span class='value'>True</span>\nprint(is_raining)  <span class='concept'># True</span>", controls: [{ key:"A", text:"is_raining" }], op:"identity", challenge: { question:"What does Python print when is_raining = False?", answers:["True", "False"], correct:1, success:"Exactly. A Boolean variable holds its own truth value." } },
  { title: "The AND gate", label: "Level 2 · both must agree", intro: "Use and when every condition needs to be true. One False is enough to make the whole expression False.", code: "has_ticket = <span class='value'>True</span>\nis_old_enough = <span class='value'>True</span>\ncan_enter = has_ticket <span class='syntax'>and</span> is_old_enough", controls: [{key:"A",text:"has_ticket"},{key:"B",text:"is_old_enough"}], op:"and", challenge: { question:"A visitor has a ticket, but is not old enough. Can they enter?", answers:["True", "False"], correct:1, success:"Right. AND requires both conditions to pass." } },
  { title: "The OR gate", label: "Level 3 · either route works", intro: "Use or when at least one condition is enough. It only returns False when both sides are False.", code: "is_weekend = <span class='value'>False</span>\nis_holiday = <span class='value'>True</span>\ncan_sleep_in = is_weekend <span class='syntax'>or</span> is_holiday", controls: [{key:"A",text:"is_weekend"},{key:"B",text:"is_holiday"}], op:"or", challenge: { question:"It is neither the weekend nor a holiday. Can you sleep in?", answers:["True", "False"], correct:1, success:"You got it. OR needs at least one True input." } },
  { title: "Flip it with NOT", label: "Level 4 · reverse a result", intro: "The not operator reverses a Boolean value. It is especially useful for checking whether something is missing or unavailable.", code: "is_logged_in = <span class='value'>True</span>\nshow_welcome = <span class='syntax'>not</span> is_logged_in", controls: [{key:"A",text:"is_logged_in"}], op:"not", challenge: { question:"If is_logged_in is True, what is not is_logged_in?", answers:["True", "False"], correct:1, success:"Perfect. NOT simply flips the truth value." } }
];

const storeKey = "logic-lab-complete";
let completed = new Set(JSON.parse(localStorage.getItem(storeKey) || "[]"));
const list = document.querySelector("#level-list");

function calculate(op, values) { if (op === "and") return values.A && values.B; if (op === "or") return values.A || values.B; if (op === "not") return !values.A; return values.A; }
function saveProgress() { localStorage.setItem(storeKey, JSON.stringify([...completed])); updateProgress(); }
function updateProgress() { const number = completed.size; document.querySelector("#progress-text").textContent = `${number} / ${levels.length} levels`; document.querySelector("#progress-caption").textContent = number === levels.length ? "All clear—your logic instincts are growing." : number ? `${number} lesson${number > 1 ? "s" : ""} complete. Keep going.` : "Begin with level 1."; }
function render() {
  levels.forEach((level, index) => {
    const fragment = document.querySelector("#level-template").content.cloneNode(true);
    const card = fragment.querySelector(".level-card"); const body = fragment.querySelector(".level-body");
    card.dataset.index = index; card.classList.toggle("complete", completed.has(index));
    fragment.querySelector(".level-number").textContent = String(index + 1).padStart(2, "0");
    fragment.querySelector(".level-label").textContent = level.label; fragment.querySelector(".level-title").textContent = level.title;
    fragment.querySelector(".level-status").textContent = completed.has(index) ? "Complete ✓" : index === 0 || completed.has(index - 1) ? "Ready" : "Locked";
    const locked = index > 0 && !completed.has(index - 1); if (locked) card.classList.add("locked");
    body.innerHTML = `<p class="lesson-intro">${level.intro}</p><div class="code-panel">${level.code}</div><div class="lab"><div class="lab-heading"><strong>Try it yourself</strong><span>toggle the inputs</span></div><div class="switches"></div><div class="result-panel"><span>result →</span><span class="truth-pill"></span></div></div><div class="challenge"><h4>Quick check</h4><p>${level.challenge.question}</p><div class="answer-options"></div><p class="feedback"></p></div>`;
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
