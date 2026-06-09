let userScore = 0;
let currentQuestionIndex = 0;
const maxScore = 10; // Всего вопросов

// Вопросы и ответы
const questions = [
    {
        text: "Какой из вариантов соответствует правильному порядку обработки фруктов и овощей перед использованием в кофейне?",
        answers: [
            { text: "Замочить в специальной емкости с раствором, затем промыть проточной водой и дать высохнуть перед хранением.", correct: true },
            { text: "Промыть под холодной водой, убрать поврежденные части, нарезать и сразу использовать.", correct: false },
            { text: "Очищенные фрукты и овощи следует обдать кипятком перед хранением.", correct: false },
            { text: "Достаточно просто снять наклейки и убрать в холодильник в чистой гастроемкости.", correct: false }
        ]
    },
    {
        text: "Какой из перечисленных шагов НЕ соответствует правильному алгоритму обработки имбиря в кофейне?",
        answers: [
            { text: "Осмотреть имбирь, убедиться в его качестве и при необходимости списать испорченные куски.", correct: false },
            { text: "Очистить имбирь ножом сразу после осмотра, затем замочить в растворе «Хлортаб».", correct: true },
            { text: "После обработки в растворе «Хлортаб» промыть имбирь под проточной водой, при необходимости использовать щетку.", correct: false },
            { text: "Разрезать имбирь вдоль и поперек на части перед хранением, затем поместить в сухой контейнер, промаркировать и убрать в холодильник.", correct: false }
        ]
    },
    {
        text: "Что делать с кожурой банана после того, как мы его почистили?",
        answers: [
            { text: "Выбросить ее, она нам больше не нужна", correct: false },
            { text: "Взвесить ее и занести в лист списания, а далее – выбросить", correct: true },
            { text: "Оставить для приготовления напитков", correct: false },
            { text: "Отправить в отдел качества для лабораторных проб", correct: false }
        ]
    },
    {
        text: "Какое из перечисленных действий при заготовке халвы недопустимо?",
        answers: [
            { text: "Натереть халву на крупной терке, предварительно постелив пергамент на желтую разделочную доску.", correct: false },
            { text: "Пересыпать натертую халву в чистый контейнер, плотно закрыть крышкой и промаркировать.", correct: false },
            { text: "Натирать халву, удерживая ее частично в упаковке, чтобы было удобнее держать.", correct: true },
            { text: "Хранить натертую халву в отдельных контейнерах, не смешивая партии.", correct: false }
        ]
    },
    {
        text: "Как правильно обеззараживать фрукты и овощи?",
        answers: [
            { text: "Замочить их в обеззараживающем растворе, а потом убрать непригодные продукты", correct: false },
            { text: "Убрать непригодные продукты, а далее замочить в обеззараживающем растворе, после чего тщательно промыть под холодной водой", correct: true },
            { text: "Тщательно промыть продукты под холодной водой, а далее замочить в обеззараживающем растворе. Далее их можно использовать", correct: false },
            { text: "Убрать непригодные продукты, а перед использование тщательно промыть под теплой водой", correct: false }
        ]
    },
    {
        text: "Почему нельзя пересыпать только что перемолотый шоколад в контейнер с ранее перемолотым шоколадом?",
        answers: [
            { text: "Две партии шоколада перемешаются, определить срок годности будет невозможно.", correct: true },
            { text: "Вкусы молочного и горького шоколада могут смешиваться неправильно.", correct: false },
            { text: "Новый шоколад может быть теплее, чем старый, что приведет к его таянию.", correct: false },
            { text: "Контейнер с ранее перемолотым шоколадом может испортиться быстрее, если добавить в него новую порцию.", correct: false }
        ]
    },
    {
        text: "Что неверно делать при приготовлении шоколада для конфет ручной работы?",
        answers: [
            { text: "Постоянное помешивать шоколад во время варки.", correct: false },
            { text: "Использовать горький шоколад вместо молочного.", correct: true },
            { text: "Закрывать и маркировать  все вскрытые продукты перед хранением.", correct: false },
            { text: "Замораживать готовый шоколад перед дальнейшим использованием.", correct: false }
        ]
    },
    {
        text: "Какой из перечисленных вариантов правильно описывает процесс подготовки и хранения добавок в соусниках?",
        answers: [
            { text: "Соусники можно наполнять «на глаз», главное – плотно закрыть их крышкой перед хранением.", correct: false },
            { text: "Все соусники с добавками хранятся в холодильнике без маркировки, так как срок годности можно отслеживать по дате вскрытия упаковки.", correct: false },
            { text: "Новые соусники всегда размещают на полке холодильника впереди, чтобы бариста брал их первыми.", correct: false },
            { text: "Перед фасовкой соусников необходимо обработать упаковки с продуктом дезинфицирующим средством, затем использовать весы для точного измерения порций и маркировать как соусники, так и вскрытые упаковки.", correct: true }
        ]
    },
    {
        text: "Какое из перечисленных действий при пополнении продуктов в баре является ошибочным?",
        answers: [
            { text: "Пополнять зефир в контейнер, не очищая его от остатков предыдущей партии.", correct: true },
            { text: "Использовать отдельную чистую ложку для каждого вида мороженого.", correct: false },
            { text: "Маркировать контейнер с листовым чаем после пополнения, указывая дату и время.", correct: false },
            { text: "Хранить специи и «посыпки» в небольших баночках в рабочей зоне при комнатной температуре.", correct: false }
        ]
    },
    {
        text: "Как правильно распределить сроки хранения различных заготовок в кофейне? Выберите единственно верный вариант.",
        answers: [
            { text: "Перемолотый шоколад – 5 суток, замороженный шоколад для конфет – 15 суток, сметана в соусниках – 24 часа", correct: true },
            { text: "Перемолотый шоколад 7 суток, замороженный шоколад для конфет – 7 суток, сметана в соусниках – 24 часа", correct: false },
            { text: "Перемолотый шоколад 5 суток, замороженный шоколад для конфет – 30 суток, сметана в соусниках – 36 часов", correct: false },
            { text: "Перемолотый шоколад 7 суток, замороженный шоколад для конфет – 7 суток, сметана в соусниках – 12 часов", correct: false }
        ]
    }
];

// Призы за каждый вопрос
const amounts = [1000, 5000, 10000, 15000, 25000, 50000, 100000, 200000, 500000, 1000000];

// Селекторы
const progressScreen = document.getElementById("progress-screen");
const questionScreen = document.getElementById("question-screen");
const errorScreen = document.getElementById("error-screen");
const successScreen = document.getElementById("success-screen");

const progressList = document.getElementById("progress-list");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");

const retryBtn = document.getElementById("retry-btn");
const finishBtn = document.getElementById("finish-btn");

const popupInfo = document.getElementById("popup-info");
const closePopupBtn = document.getElementById("close-popup-btn");

const errorPopup = document.getElementById("error-popup");
const successPopup = document.getElementById("success-popup");

// Аудио
const thinkingAudio = document.getElementById("thinking-audio");
const correctAudio = document.getElementById("correct-audio");
const wrongAudio = document.getElementById("wrong-audio");
const winGameAudio = document.getElementById("win-game-audio");

// Переключение экранов
function showScreen(screenEl) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    screenEl.classList.add("active");
}

// Инициализация игры
function initGame() {
    userScore = 0;
    currentQuestionIndex = 0;
    updateProgress();
    loadQuestion();
}

// Обновление прогресса (суммы)
function updateProgress() {
    progressList.innerHTML = "";
    amounts.forEach((amount, index) => {
        const li = document.createElement("li");
        li.textContent = amount;
        if (index === currentQuestionIndex) {
            li.classList.add("active");
        } else if (index > currentQuestionIndex) {
            li.classList.add("disabled");
        }
        progressList.appendChild(li);
    });
}

// Загрузка вопроса
function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        // Все вопросы отвечены верно -> победа
        handleWinGame();
        return;
    }
    const q = questions[currentQuestionIndex];
    questionText.textContent = q.text;
    answersContainer.innerHTML = "";

    // Перемешиваем варианты ответа
    const shuffledAnswers = q.answers.slice();
    for (let i = shuffledAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
    }

    // Массив букв для вариантов (A, B, C, D)
    const letters = ["A", "B", "C", "D"];

    shuffledAnswers.forEach((ans, idx) => {
        const btn = document.createElement("button");
        // Добавляем буквы (A, B, C, D) оранжевым цветом
        btn.innerHTML = `<span class="answer-label">${letters[idx]}:</span><span class="answer-text">${ans.text}</span>`;

        btn.addEventListener("click", () => {
            // Запрещаем повторные клики
            answersContainer.querySelectorAll("button").forEach(b => b.disabled = true);

            if (ans.correct) {
                // Подсветка правильного ответа
                btn.classList.add("highlight-correct");
                correctAudio.currentTime = 0;
                correctAudio.play();

                setTimeout(() => {
                    userScore++;
                    currentQuestionIndex++;
                    if (currentQuestionIndex >= questions.length) {
                        handleWinGame();
                    } else {
                        updateProgress();
                        showScreen(progressScreen);
                        // Пауза на экране прогресса 1.5 секунды перед загрузкой следующего вопроса
                        setTimeout(() => {
                            loadQuestion();
                        }, 1500);
                    }
                }, 2000); // Задержка увеличена до 2000 мс для возможности прочитать результат
            } else {
                // Подсветка неправильного ответа
                btn.classList.add("highlight-wrong");
                // Находим и подсвечиваем правильный вариант
                const buttons = answersContainer.querySelectorAll("button");
                const correctIndex = shuffledAnswers.findIndex(a => a.correct);
                const correctBtn = buttons[correctIndex];
                correctBtn.classList.add("highlight-correct");

                wrongAudio.currentTime = 0;
                wrongAudio.play();

                setTimeout(() => {
                    showScreen(errorScreen);
                }, 2000); // Задержка увеличена до 2000 мс
            }
        });
        answersContainer.appendChild(btn);
    });
    showScreen(questionScreen);

    // Отображение поп-апа на первом вопросе
    if (currentQuestionIndex === 0 && popupInfo) {
        popupInfo.style.display = "flex";
    }
}


// Победа
function handleWinGame() {
    showScreen(successScreen);
    successPopup.style.display = "none";
    winGameAudio.currentTime = 0;
    winGameAudio.play();
    winGameAudio.onended = () => {
        successPopup.style.display = "flex";
    };
}

// Клик по прогресс-бару, если он «active»
progressList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI" && e.target.classList.contains("active")) {
        loadQuestion();
    }
});

// Закрытие поп-апа первого вопроса
if (closePopupBtn) {
    closePopupBtn.addEventListener("click", () => {
        popupInfo.style.display = "none";
    });
}

// "Начать заново"
retryBtn.addEventListener("click", () => {
    initGame();
});

// "Завершить" — отправка баллов в SCORM
finishBtn.addEventListener("click", () => {
    // Предположим есть функция sendScore(userScore, maxScore)
    sendScore();
    window.top.location.href = "https://sc-learn.ru/mod/page/view.php?id=382";
});

// Запуск игры при загрузке
window.addEventListener("load", initGame);
