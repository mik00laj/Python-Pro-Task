document.addEventListener('DOMContentLoaded', function () {
    const questionDescription = document.querySelector('.question-description');
    const answerInput = document.querySelector('.answer-input');
    const quizCheckButton = document.querySelector('.quiz-check');
    let currentQuestionId = null;

    function loadQuestion() {
        console.log('Loading question...');
        axios.get('/get_question')
            .then(response => {
                const question = response.data;
                if (question.error) {
                    questionDescription.textContent = 'Brak pytań';
                } else {
                    questionDescription.textContent = question.question;
                    document.querySelector('.questionA').textContent = 'A) ' + question.A;
                    document.querySelector('.questionB').textContent = 'B) ' + question.B;
                    document.querySelector('.questionC').textContent = 'C) ' + question.C;
                    document.querySelector('.questionD').textContent = 'D) ' + question.D;
                    currentQuestionId = question._id;
                    answerInput.value = ''
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function checkAnswer() {
        let userAnswer = answerInput.value.trim().toUpperCase();
        if (userAnswer) {
            axios.post('/submit_answer', {
                answer: userAnswer,
                question_id: currentQuestionId
            })
                .then(response => {
                    const result = response.data;
                    if (result.correct) {
                        alert('Poprawna odpowiedź!');
                        updateScoreboard();
                        loadQuestion();

                    } else {
                        alert('Niepoprawna odpowiedź!');
                        loadQuestion();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            alert('Podaj odpowiedź!');
        }
    }

    function updateScoreboard() {
        const loggedPoints = document.querySelector(".logged-points")
        let currentPoints = parseInt(loggedPoints.textContent);
        currentPoints++;
        loggedPoints.textContent = currentPoints;
    }
    quizCheckButton.addEventListener('click', checkAnswer);
    loadQuestion();
});
