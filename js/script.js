const startButton = document.querySelector(".start_btn button");
const infoBox = document.querySelector(".info_box");
const exitButton = infoBox.querySelector(".buttons .quit");
const continueButton = infoBox.querySelector(".buttons .restart");
const quizBox = document.querySelector(".quiz_box");
const resultBox = document.querySelector(".result_box");
const optionsContainer = document.querySelector(".option_list");
const timerLine = document.querySelector("header .time_line");
const timerText = document.querySelector(".timer .time_left_txt");
const timerSeconds = document.querySelector(".timer .timer_sec");

const nextButton = document.querySelector("footer .next_btn");
const questionCounter = document.querySelector("footer .total_que");

startButton.addEventListener('click', () => {
    infoBox.classList.add("activeInfo");
});

exitButton.addEventListener('click', () => {
    infoBox.classList.remove("activeInfo");
});

continueButton.addEventListener('click', () => {
    infoBox.classList.remove("activeInfo");
    quizBox.classList.add("activeQuiz");
    displayQuestion(0);
    updateQuestionCounter(1);
    startQuizTimer(15);
    startProgressBar(0);
});

let timeRemaining = 15;
let currentQuestionIndex = 0;
let questionNumber = 1;
let userScore = 0;
let timerInterval;
let progressBarInterval;
let progressBarWidth = 0;

resultBox.querySelector(".buttons .restart").addEventListener('click', () => {
    quizBox.classList.add("activeQuiz");
    resultBox.classList.remove("activeResult");
    resetQuiz();
    displayQuestion(currentQuestionIndex);
    updateQuestionCounter(questionNumber);
    startQuizTimer(timeRemaining);
    startProgressBar(progressBarWidth);
    timerText.textContent = "Time Left";
    nextButton.classList.remove("show");
});

resultBox.querySelector(".buttons .quit").addEventListener('click', () => {
    window.location.reload();
});

nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        questionNumber++;
        displayQuestion(currentQuestionIndex);
        updateQuestionCounter(questionNumber);
        startQuizTimer(timeRemaining);
        startProgressBar(progressBarWidth);
        timerText.textContent = "Time Left";
        nextButton.classList.remove("show");
    } else {
        clearInterval(timerInterval);
        clearInterval(progressBarInterval);
        showFinalResult();
    }
});

function displayQuestion(index) {
    const questionElement = document.querySelector(".que_text");
    const questionData = questions[index];
    const questionHTML = `<span>${questionData.numb}. ${questionData.question}</span>`;
    const optionsHTML = questionData.options.map(option => 
        `<div class="option"><span>${option}</span></div>`
    ).join('');
    
    questionElement.innerHTML = questionHTML;
    optionsContainer.innerHTML = optionsHTML;

    optionsContainer.querySelectorAll(".option").forEach(option => {
        option.addEventListener('click', () => selectOption(option));
    });
}

function selectOption(selectedOption) {
    clearInterval(timerInterval);
    clearInterval(progressBarInterval);
    
    const userAnswer = selectedOption.textContent;
    const correctAnswer = questions[currentQuestionIndex].answer;
    const allOptions = optionsContainer.children;

    if (userAnswer === correctAnswer) {
        userScore++;
        selectedOption.classList.add("correct");
        selectedOption.insertAdjacentHTML("beforeend", '<div class="icon tick"><i class="fas fa-check"></i></div>');
    } else {
        selectedOption.classList.add("incorrect");
        selectedOption.insertAdjacentHTML("beforeend", '<div class="icon cross"><i class="fas fa-times"></i></div>');
        Array.from(allOptions).forEach(option => {
            if (option.textContent === correctAnswer) {
                option.classList.add("correct");
                option.insertAdjacentHTML("beforeend", '<div class="icon tick"><i class="fas fa-check"></i></div>');
            }
        });
    }
    
    Array.from(allOptions).forEach(option => option.classList.add("disabled"));
    nextButton.classList.add("show");
}

function resetQuiz() {
    timeRemaining = 15;
    currentQuestionIndex = 0;
    questionNumber = 1;
    userScore = 0;
    progressBarWidth = 0;
    clearInterval(timerInterval);
    clearInterval(progressBarInterval);
}

function showFinalResult() {
    infoBox.classList.remove("activeInfo");
    quizBox.classList.remove("activeQuiz");
    resultBox.classList.add("activeResult");

    const resultText = resultBox.querySelector(".score_text");
    const resultMessage = userScore > 3 ? 
        `and congrats! 🎉, You got <p>${userScore}</p> out of <p>${questions.length}</p>` :
        userScore > 1 ? 
        `and nice 😎, You got <p>${userScore}</p> out of <p>${questions.length}</p>` :
        `and sorry 😐, You got only <p>${userScore}</p> out of <p>${questions.length}</p>`;

    resultText.innerHTML = `<span>${resultMessage}</span>`;
}

function startQuizTimer(duration) {
    timerInterval = setInterval(() => {
        timerSeconds.textContent = duration;
        duration--;
        if (duration < 0) {
            clearInterval(timerInterval);
            timerText.textContent = "Time Off";
            Array.from(optionsContainer.children).forEach(option => {
                if (option.textContent === questions[currentQuestionIndex].answer) {
                    option.classList.add("correct");
                    option.insertAdjacentHTML("beforeend", '<div class="icon tick"><i class="fas fa-check"></i></div>');
                }
                option.classList.add("disabled");
            });
            nextButton.classList.add("show");
        } else if (duration < 10) {
            timerSeconds.textContent = `0${duration}`;
        }
    }, 1000);
}

function startProgressBar(time) {
    progressBarInterval = setInterval(() => {
        time += 1;
        timerLine.style.width = `${time}px`;
        if (time > 549) {
            clearInterval(progressBarInterval);
        }
    }, 29);
}

function updateQuestionCounter(index) {
    questionCounter.innerHTML = `<span><p>${index}</p> of <p>${questions.length}</p> Questions</span>`;
}
