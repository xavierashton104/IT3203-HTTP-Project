const quiz = document.getElementById("http-quiz");
const results = document.getElementById("quiz-results");
const passingScore = 7; // The guide does not specify a cutoff.
const timer = document.getElementById("quiz-timer");
const timeLimit = 10 * 60;
let startedAt;
let timerInterval;
let finished;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const leftover = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${leftover}`;
}

function elapsedSeconds() {
    return Math.min(timeLimit, Math.floor((Date.now() - startedAt) / 1000));
}

function startTimer() {
    clearInterval(timerInterval);
    startedAt = Date.now();
    finished = false;
    timer.textContent = formatTime(timeLimit);

    // Use the actual elapsed time so switching tabs doesn't slow the clock.
    timerInterval = setInterval(function () {
        const remaining = timeLimit - elapsedSeconds();
        timer.textContent = formatTime(remaining);

        if (remaining === 0) {
            quiz.requestSubmit();
        }
    }, 250);
}

const answerKey = [
    { accepted: ["hypertext transfer protocol", "hyper text transfer protocol"], answer: "Hypertext Transfer Protocol" },  
    { values: ["404"], answer: "404" },
    { values: ["get"], answer: "GET" },
    { values: ["ok"], answer: "OK" },
    { values: ["http-3"], answer: "HTTP/3" },
    { values: ["get", "post"], answer: "GET and POST" },
    { values: ["browser"], answer: "The browser" },
    { values: ["response"], answer: "A response" },
    { values: ["http-2"], answer: "HTTP/2" },
    { values: ["content-type"], answer: "The Content-Type header" }
];

quiz.addEventListener("submit", function (event) {
    event.preventDefault(); // Keep the results on the quiz page.
    if (finished) return;
finished = true;
clearInterval(timerInterval);

    const answers = new FormData(quiz);
    const feedback = document.createElement("ol");
    let score = 0;

    answerKey.forEach(function (question, index) {
        // getAll also reads both checked answers for Question 6.
        const selected = answers.getAll("q" + (index + 1)).map(function (value) {
            return value.trim().toLowerCase().replace(/\s+/g, " ");
        });

        const correct = question.accepted
    ? selected.length === 1 && question.accepted.includes(selected[0])
    : selected.length === question.values.length &&
      question.values.every(function (value) {
          return selected.includes(value);
      });

        if (correct) {
            score++;
        }

        const item = document.createElement("li");
        item.className = correct ? "quiz-correct" : "quiz-incorrect";
        item.textContent = `${correct ? "Correct (1/1)" : "Incorrect (0/1)"} — Answer: ${question.answer}`;
        feedback.appendChild(item);
    });

    const summary = document.createElement("h2");
    const outcome = score >= passingScore ? "Pass" : "Fail";
    summary.textContent = `${outcome} — ${score}/${answerKey.length}`;
const timeSpent = document.createElement("p");
timeSpent.textContent = `Time spent: ${formatTime(elapsedSeconds())}`;
results.replaceChildren(summary, timeSpent, feedback);});

quiz.addEventListener("reset", function () {
    results.replaceChildren();
    startTimer();
});

startTimer();