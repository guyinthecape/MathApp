document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.getElementById('question');
    const answerInput = document.getElementById('answerInput');
    const checkAnswerButton = document.getElementById('checkAnswer');
    const nextQuestionButton = document.getElementById('nextQuestion');
    const feedbackElement = document.getElementById('feedback');
    const choiceButtons = document.querySelectorAll('.choiceButton');
    const timerCircleFront = document.querySelector('.timer-circle-front');
    const timerText = document.querySelector('.timer-text');
    let currentAnswer = 0;
    let selectedType = '';
    let countdown;
    let totalSeconds = 18; // Default timer for addition and subtraction

    function resetTimer() {
        clearInterval(countdown);
        timerCircleFront.style.strokeDashoffset = 283; // Reset circle
        timerText.textContent = ''; // Clear timer text
    }

    function startTimer() {
        let timeLeft = totalSeconds;
        resetTimer(); // Reset the timer visually
        timerText.textContent = timeLeft; // Update timer text

        countdown = setInterval(() => {
            timeLeft -= 1;
            if (timeLeft < 0) {
                clearInterval(countdown);
                feedbackElement.textContent = "Time's up!";
                feedbackElement.style.color = 'red';
                showCorrectAnswer();
                nextQuestion(); // Prepare for the next question without waiting for user input
                return;
            }
            timerText.textContent = timeLeft; // Update timer text
            const offset = (283 * timeLeft) / totalSeconds - 283;
            timerCircleFront.style.strokeDashoffset = offset;
        }, 1000);
    }

    function generateQuestion() {
        const num1 = Math.floor(Math.random() * 89) + 10; // 10 to 99
        const num2 = selectedType === 'percentage' ? Math.floor(Math.random() * 8) + 2 : Math.floor(Math.random() * 89) + 10; // 2 to 10 for percentages, else 10 to 99
        totalSeconds = selectedType === 'percentage' ? 45 : 18; // Adjust timer

        switch (selectedType) {
            case 'addition':
                currentAnswer = num1 + num2;
                questionElement.textContent = `What is ${num1} + ${num2}?`;
                break;
            case 'subtraction':
                currentAnswer = num1 - num2;
                questionElement.textContent = `What is ${num1} - ${num2}?`;
                break;
            case 'percentage':
                currentAnswer = Math.round((num2 / 100) * num1);
                questionElement.textContent = `What is ${num2}% of ${num1}?`;
                break;
            case 'mix':
                const types = ['addition', 'subtraction', 'percentage'];
                selectedType = types[Math.floor(Math.random() * types.length)];
                generateQuestion(); // Recursively generate a mix question
                return;
        }
        answerInput.value = ''; // Clear the input field
        feedbackElement.textContent = ''; // Clear feedback text
    }

    function nextQuestion() {
        if (!selectedType) {
            feedbackElement.textContent = "Please select a type of question.";
            feedbackElement.style.color = 'red';
            return;
        }
        generateQuestion(); // Generate a question ready for the next round
        startTimer(); // Start the countdown timer
    }

    function showCorrectAnswer() {
        feedbackElement.innerHTML = `Incorrect. The correct answer was ${currentAnswer}. Try another question!`;
    }

    function checkAnswer() {
        clearInterval(countdown); // Stop the timer
        const userAnswer = parseFloat(answerInput.value);
        if (isNaN(userAnswer)) {
            feedbackElement.textContent = "Please enter a number.";
            feedbackElement.style.color = "red";
            return;
        }
        if (userAnswer === currentAnswer) {
            feedbackElement.textContent = "Correct!";
            feedbackElement.style.color = "green";
        } else {
            feedbackElement.style.color = "red";
            showCorrectAnswer();
        }
        answerInput.value = ''; // Clear the input field
    }

    choiceButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            selectedType = e.target.getAttribute('data-type');
            resetTimer(); // Reset the timer visually but don't start it
            generateQuestion(); // Generate a question but don't start the timer
        });
    });

    checkAnswerButton.addEventListener('click', checkAnswer);
    nextQuestionButton.addEventListener('click', nextQuestion);
});
