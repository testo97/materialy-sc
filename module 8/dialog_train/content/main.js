document.addEventListener("DOMContentLoaded", () => {
    // Панели для экранов 1–4 (экраны с классом .panel)
    const panels = document.querySelectorAll(".panel")
    const dialogScreen = document.querySelector(".dialog")
    const nextBtns = document.querySelectorAll(".next-btn")
    const backBtns = document.querySelectorAll(".back-btn")
    const progressFill = document.querySelector(".progress-fill")
    const dialogBox = document.querySelector(".dialog-box")
    const speakerName = document.querySelector(".speaker-name")
    const dialogText = document.querySelector(".dialog-text")
    const questionHeader = document.querySelector(".question-header")
    const notification = document.querySelector(".notification")
    const notificationText = document.querySelector(".notification-text")
    const notificationBtn = document.querySelector(".notification-btn")
    const characterGuest = document.querySelector(".character-guest")
    const characterGuestName = document.querySelector(".character-guest .character-name")
    const baristaHands = document.querySelector(".barista-hands")
    const dialogBackground = document.querySelector(".dialog-background")
    const dialogAudio = document.getElementById("dialog-audio");
    const finishBtn = document.getElementById("finish-btn");
    finishBtn.addEventListener("click", () => {
        sendScore();
        window.top.location.href = "https://sc-learn.ru/mod/scorm/view.php?id=448";
    });

    // Добавляем элемент руки с кофе в DOM, если его еще нет
    let coffeeHand = document.querySelector(".coffee-hand")
    if (!coffeeHand) {
        coffeeHand = document.createElement("div")
        coffeeHand.className = "coffee-hand"
        document.querySelector(".dialog-scene").appendChild(coffeeHand)
    }

    // Добавляем элемент стойки в DOM, если его еще нет
    let counter = document.querySelector(".counter")
    if (!counter) {
        counter = document.createElement("div")
        counter.className = "counter"
        document.querySelector(".dialog-scene").appendChild(counter)
    }

    // Add cash register element
    let cashRegister = document.querySelector(".cash-register")
    if (!cashRegister) {
        cashRegister = document.createElement("div")
        cashRegister.className = "cash-register"
        document.querySelector(".dialog-scene").appendChild(cashRegister)
    }

    // Add payment terminal element
    let paymentTerminal = document.querySelector(".payment-terminal")
    if (!paymentTerminal) {
        paymentTerminal = document.createElement("div")
        paymentTerminal.className = "payment-terminal"
        document.querySelector(".dialog-scene").appendChild(paymentTerminal)
    }

    // Добавляем элемент двух рук в DOM, если его еще нет
    let twoHands = document.querySelector(".two-hands")
    if (!twoHands) {
        twoHands = document.createElement("div")
        twoHands.className = "two-hands"
        document.querySelector(".dialog-scene").appendChild(twoHands)
    }

    let currentPanel = 0 // Индекс текущей панели (0-3)
    let currentDialogStep = 0
    let satisfactionLevel = 20 // Начальный уровень удовлетворенности (в процентах)
    let currentDialogue = [] // Текущий диалог
    let coffeeSceneActive = false // Флаг для отслеживания активации сцены с кофе
    let coffeePickupPhraseShown = false // Флаг для отслеживания показа фразы с кофе
    let angryGuestShown = false // Флаг для отслеживания показа злого гостя

    // Сценарий диалога для гостя (Алексей)
    const alexeyDialogue = [
        {
            question: "Итак, перед тобой первый гость кофейни. Что скажешь ему?",
            options: shuffleOptions([
                { text: "Добрый день! Что для вас приготовить?", correct: true },
                {
                    text: "Добрый день!", correct: false,
                    hint: "Попробуй найти более вежливый ответ, который будет оставлять впечатление у гостя. Попробуй пройти тренажер заново и оставить приятное впечатление у гостя.",
                },
                {
                    text: "Что для вас?", correct: false,
                    hint: "Попробуй найти более вежливый ответ, который будет оставлять впечатление у гостя. Попробуй пройти тренажер заново и оставить приятное впечатление у гостя.",
                },
                {
                    text: "Определились ли вы уже с заказом?", correct: false,
                    hint: "Попробуй найти более вежливый ответ, который будет оставлять впечатление у гостя. Попробуй пройти тренажер заново и оставить приятное впечатление у гостя.",
                }
            ]),
            guestResponse: "Я хотел бы сырники и капучино.",
            speakerName: "Денис",
            guestName: "Алексей",
        },
        {
            question: "Что стоит спросить гостя далее?",
            options: shuffleOptions([
                {
                    text: "Конечно. Какого объема для вас приготовить капучино?", correct: false,
                    hint: "Увы! Это неверный вопрос на данном этапе. После приветствия мы должны обязательно спросить, как приготовить заказ: «здесь» или «с собой». Попробуй пройти тренажер заново и оставить приятное впечатление у гостя.",
                },
                {
                    text: "Вам приготовить заказ «здесь» или «с собой»?",
                    correct: true
                },
                {
                    text: "Отличный выбор! Добавить ли в капучино сахар, корицу, сироп?",
                    correct: false,
                    hint: "Увы! Это неверный вопрос на данном этапе. После приветствия мы должны обязательно спросить, как приготовить заказ: «здесь» или «с собой». Попробуй пройти тренажер заново и оставить приятное впечатление у гостя.",
                },
                {
                    text: "Вы хотели бы капучино помягче или покрепче?",
                    correct: false,
                    hint: "Увы! Это неверный вопрос на данном этапе. После приветствия мы должны обязательно спросить, как приготовить заказ: «здесь» или «с собой». Попробуй пройти тренажер заново и оставить приятное впечатление у гостя.",
                },
                {
                    text: "Капучино приготовить с собой, а сырники на месте?",
                    correct: false,
                    hint: "Увы! Это неверный вопрос на данном этапе. После приветствия мы должны обязательно спросить, как приготовить заказ: «здесь» или «с собой». Попробуй пройти тренажер заново и оставить приятное впечатление у гостя.",
                }
            ]),
            guestResponse: "Я хотел бы покушать здесь.",
            speakerName: "Денис",
            guestName: "Алексей",
        },
        {
            question: "О чем стоит спросить далее?",
            options: shuffleOptions([
                { text: "Какого объема сделать для вас капучино?", correct: true },
                {
                    text: "Для вас капучино сделать большой?",
                    correct: false,
                    hint: "К сожалению, ты выбрал неправильный ответ на этом этапе. Спросили «здесь» или «с собой» - уточни объем напитка. Попробуй начать обслуживание гостя снова.",
                },
                {
                    text: "Добавить ли сахар, сироп или корицу в капучино?",
                    correct: false,
                    hint: "К сожалению, ты выбрал неправильный ответ на этом этапе. Спросили «здесь» или «с собой» - уточни объем напитка. Попробуй начать обслуживание гостя снова.",
                },
                {
                    text: "Нужен ли для вас поднос?",
                    correct: false,
                    hint: "К сожалению, ты выбрал неправильный ответ на этом этапе. Спросили «здесь» или «с собой» - уточни объем напитка. Попробуй начать обслуживание гостя снова.",
                }
            ]),
            guestResponse: "Я хотел бы большой капучино.",
            speakerName: "Денис",
            guestName: "Алексей",
        },
        {
            question: "О чем стоит спросить или что сказать далее?",
            options: shuffleOptions([
                {
                    text: "Добавить ли сахар, корицу в капучино?",
                    correct: false,
                    hint: "Это неверный вопрос. После уточнения объема напитка необходимо спросить о том, какие добавки нужны к напитку. Начни сначала.",
                },
                {
                    text: "Необходимо ли подогреть сырники?",
                    correct: false,
                    hint: "Это неверный вопрос. После уточнения объема напитка необходимо спросить о том, какие добавки нужны к напитку. Начни сначала.",
                },
                {
                    text: "У вас большой капучино и сырники, с вас 590 рублей.",
                    correct: false,
                    hint: "Это неверный вопрос. После уточнения объема напитка необходимо спросить о том, какие добавки нужны к напитку. Начни сначала.",
                },
                {
                    text: "Добавить ли сахар, корицу или сироп в капучино?",
                    correct: true
                }
            ]),
            guestResponse: "Нет, просто кофе.",
            speakerName: "Денис",
            guestName: "Алексей",
        },
        {
            question: "О чем скажешь/спросишь далее?",
            options: shuffleOptions([
                {
                    text: "Необходимо ли подогреть сырники?",
                    correct: false,
                    hint: "Увы, неверно. Гость недоволен. Если в заказе есть блюдо, которое предполагает возможные добавки (сырники, каша), самое время в этом месте спросить о необходимых добавках. Начни сначала.",
                },
                {
                    text: "Нужна ли сметана, сгущенка, мед или варенье к сырникам?",
                    correct: true
                },
                {
                    text: "Ваш заказ: большой капучино и сырники, все «здесь». Все ли верно?",
                    correct: false,
                    hint: "Увы, неверно. Гость недоволен. Если в заказе есть блюдо, которое предполагает возможные добавки (сырники, каша), самое время в этом месте спросить о необходимых добавках. Начни сначала.",
                },
                {
                    text: "Есть ли у вас карта гостя?",
                    correct: false,
                    hint: "Увы, неверно. Гость недоволен. Если в заказе есть блюдо, которое предполагает возможные добавки (сырники, каша), самое время в этом месте спросить о необходимых добавках. Начни сначала.",
                }
            ]),
            guestResponse: "Да, я хотел бы варенье.",
            speakerName: "Денис",
            guestName: "Алексей",
        },
        {
            question: "Что скажешь/спросишь далее?",
            options: shuffleOptions([
                {
                    text: "Есть ли у вас карта гостя?",
                    correct: false,
                    hint: "Не совсем так. Не забудь на этом этапе озвучить весь заказ гостя со всеми модификаторами. Попробуй снова.",
                },
                {
                    text: "Нужен ли пакет и приборы для вашего заказа?",
                    correct: false,
                    hint: "Не совсем так. Не забудь на этом этапе озвучить весь заказ гостя со всеми модификаторами. Попробуй снова.",
                },
                {
                    text: "Поставить ли вам наклейку за заказ?",
                    correct: false,
                    hint: "Не совсем так. Не забудь на этом этапе озвучить весь заказ гостя со всеми модификаторами. Попробуй снова.",
                },
                {
                    text: "У вас большой капучино и сырники с вареньем, все здесь. Верно?",
                    correct: true
                }
            ]),
            guestResponse: "Всё так.",
            speakerName: "Денис",
            guestName: "Алексей",
        },
        {
            question: "Что спросишь далее?",
            options: shuffleOptions([
                {
                    text: "С вас 590 рублей. Наличные или карта?",
                    correct: true
                },
                {
                    text: "С вас 590 рублей",
                    correct: false,
                    hint: "Неверно. После уточнения о карте гостя, назови сумму заказа и уточни удобный способ оплаты. А сейчас возвращайся назад.",
                },
                {
                    text: "Пожалуйста, будьте добры, с вас 590 рублей за весь заказ: сырники с вареньем и большой капучино на месте.",
                    correct: false,
                    hint: "Неверно. После уточнения о карте гостя, назови сумму заказа и уточни удобный способ оплаты. А сейчас возвращайся назад.",
                },
                {
                    text: "Прикладывайте карту, пожалуйста, к терминалу справа от вас.",
                    correct: false,
                    hint: "Неверно. После уточнения о карте гостя, назови сумму заказа и уточни удобный способ оплаты. А сейчас возвращайся назад.",
                }
            ]),
            guestResponse: "Картой.",
            speakerName: "Денис",
            guestName: "Алексей",
        },
        {
            question: "Что делаем дальше?",
            options: shuffleOptions([
                {
                    text: "Выдаю гостю чек намерения, провожу оплату, выдаю деревянную табличку",
                    correct: true,
                    isLast: true
                },
                {
                    text: "Заполняю карту гостя, провожу оплату, выдаю деревянную табличку",
                    correct: false,
                    hint: "Увы, это неверно. Попробуй снова. Если тебе нужна помощь, вернись к предыдущим заданиям марафона.",
                },
                {
                    text: "Выдаю деревянную табличку, заполняю карту гостя, провожу оплату",
                    correct: false,
                    hint: "Увы, это неверно. Попробуй снова. Если тебе нужна помощь, вернись к предыдущим заданиям марафона.",
                },
                {
                    text: "Провожу оплату, выдаю деревянную табличку",
                    correct: false,
                    hint: "Увы, это неверно. Попробуй снова. Если тебе нужна помощь, вернись к предыдущим заданиям марафона.",
                }
            ]),
            guestResponse: "",
            speakerName: "Денис",
            guestName: "Алексей",
        }
    ];

    // Изначально скрываем экраны диалога, а также окна уведомлений
    dialogScreen.classList.remove("active")
    dialogBox.classList.remove("active")
    notification.classList.remove("active")

    // Обработка нажатий на кнопки "Далее"
    nextBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (panels[currentPanel] && panels[currentPanel].classList.contains("active")) {
                panels[currentPanel].classList.remove("active")
                if (currentPanel === 3) {
                    // На 4-й панели (Денис) при нажатии "Пообщаться с гостем" сразу запускаем диалог
                    resetDialog()
                    dialogScreen.classList.add("active")
                    setupDialogForGuest("alexey")
                    loadDialogStep(0)
                    dialogAudio.currentTime = 0;
                    dialogAudio.play();
                } else {
                    currentPanel++
                    panels[currentPanel].classList.add("active")
                }
            }
        })
    })

    // Обработка нажатий на кнопки "Назад"
    backBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (dialogScreen.classList.contains("active")) {
                dialogScreen.classList.remove("active")
                panels[3].classList.add("active")
                dialogAudio.pause();
                dialogAudio.currentTime = 0;
                resetDialog()
            } else {
                panels[currentPanel].classList.remove("active")
                if (currentPanel > 0) currentPanel--
                panels[currentPanel].classList.add("active")
            }
        })
    })

    // Функция для отображения диалогового окна
    function showDialogBox(speaker, text) {
        speakerName.textContent = speaker;
        typeText(dialogText, text);
        dialogBox.classList.add("active");

        // ────────── Кастомная логика эмоций для Алексея ──────────
        // 1) После фразы бариста "Пожалуйста, ваш большой капучино, хорошего дня!" — радостное настроение
        if (
            speaker === "Денис" &&
            (
                /Пожалуйста,\s*ваш\s*большой\s*капучино/.test(text) ||
                /Заберите\s*капучино\s*большой/.test(text) ||
                /Большой\s*капучино,\s*приятного/.test(text)
            )
        ) {
            updateCharacterMood("excited");
        }
        // 2) На ответ Алексея "Не понял, я же просил..." — злое настроение
        else if (speaker === "Алексей" && /Не понял/.test(text)) {
            updateCharacterMood("angry");
            coffeeHand.classList.remove("active");
        }
        // 3) После извинения бариста "Да, действительно. Я приготовил..." — нейтральное настроение
        else if (speaker === "Денис" && /^Да,\s*действительно/.test(text)) {
            updateCharacterMood("neutral");
        }
        // 4) На реплику Алексея "Теперь точно с сиропом?" — грустное настроение
        else if (speaker === "Алексей" && /Теперь точно с сиропом/.test(text)) {
            updateCharacterMood("sad");
            coffeeHand.classList.add("active");
        }
        // 5) После финальной фразы бариста "Да-да, конечно. Ваш большой капучино с сиропом..." — радостное настроение
        else if (speaker === "Денис" && /^Да-да,\s*конечно/.test(text)) {
            updateCharacterMood("excited");
        }

        // Существующая проверка на "неправильные" ответы — оставляем без изменений,
        // она как раз переводит гостя в грустное состояние при неверном выборе:
        if (text.includes("Неверный ответ")) {
            updateCharacterMood("sad");
        }

        // Руки бариста показываем по общей логике
        if (speaker === "Денис" && text.startsWith(" Да, действительно")) {
            baristaHands.classList.remove("active")
        }
        // Во всех остальных случаях (бариста говорит и не в кофесцене) — показываем
        else if (speaker === "Денис" && !coffeeSceneActive) {
            baristaHands.classList.add("active")
            coffeeHand.classList.remove("active")
        }
        // Для любых остальных спикеров или ситуаций — убираем
        else {
            baristaHands.classList.remove("active")
        }
    }

    // Функция для показа изображения двух рук
    function showTwoHandsImage() {
        // Показываем изображение двух рук
        twoHands.classList.add("active")

        // Показываем модальное окно с жалобой через небольшую задержку
        setTimeout(() => {
            showComplaintBookModal()
        }, 2000)
    }

    // Функция для показа модального окна с жалобой
    function showComplaintBookModal() {
        // Создаем модальное окно
        const modalElement = document.createElement("div")
        modalElement.className = "complaint-modal"
        modalElement.innerHTML = `
            <div class="complaint-modal-content">
                <h3>Внимание!</h3>
                <p>Гость рассержен и требует книгу отзывов.</p>
                <div class="complaint-modal-buttons">
                    <button class="complaint-modal-next">Далее</button>
                </div>
            </div>
        `
        document.body.appendChild(modalElement)

        // Добавляем обработчик для кнопки "Далее"
        const nextButton = modalElement.querySelector(".complaint-modal-next")
        nextButton.addEventListener("click", () => {
            // Показываем вторую страницу модального окна
            showComplaintBookModalPage2(modalElement)
        })
    }

    // Функция для показа второй страницы модального окна
    function showComplaintBookModalPage2(modalElement) {
        // Обновляем содержимое модального окна
        modalElement.querySelector(".complaint-modal-content").innerHTML = `
            <h3>Внимание!</h3>
            <p>Гость рассержен и требует книгу отзывов.</p>
            <div class="complaint-modal-buttons">
                <button class="complaint-modal-finish">Завершить диалог</button>
            </div>
        `

        // Добавляем обработчик для кнопки "Завершить диалог"
        const finishButton = modalElement.querySelector(".complaint-modal-finish")
        finishButton.addEventListener("click", () => {
            // Удаляем модальное окно
            document.body.removeChild(modalElement)
            // Возвращаемся к панели с Денисом
            dialogScreen.classList.remove("active")
            panels[3].classList.add("active")
            resetDialog()
        })
    }

    // Функция настройки вариантов ответов
    function setupAnswerOptions() {
        const options = document.querySelectorAll(".answer-option")
        options.forEach((option) => {
            option.addEventListener("click", function () {
                const isCorrect = this.getAttribute("data-correct") === "true"
                const satisfactionChange = Number.parseInt(this.getAttribute("data-satisfaction-change") || "0")
                const isLast = this.getAttribute("data-last") === "true"
                const activateCoffeeScene = this.getAttribute("data-activate-coffee-scene") === "true"
                const showTwoHands = this.getAttribute("data-show-two-hands") === "true"

                if (isCorrect) {
                    updateCharacterMood("neutral");
                    this.classList.add("correct")

                    // Apply satisfaction change if specified
                    if (satisfactionChange) {
                        updateSatisfactionLevel(satisfactionChange)
                    } else {
                        updateSatisfactionLevel(10)
                    }

                    // Проверяем, нужно ли активировать сцену с кофе
                    if (
                        activateCoffeeScene ||
                        this.textContent.includes("Заберите капучино большой. До свидания.") ||
                        this.textContent.includes("Ваш латте с корицей и сиропом. Хорошего дня!")
                    ) {
                        activateCoffeeSceneMode()
                    }

                    // Исправление: удаляем эмодзи из текста перед отображением
                    let cleanText = this.textContent
                    if (cleanText.startsWith("💬") || cleanText.startsWith("🤔") || cleanText.startsWith("✋")) {
                        cleanText = cleanText.substring(2) // Удаляем эмодзи и пробел после него
                    }

                    // Проверяем, нужно ли показать две руки
                    if (showTwoHands || cleanText.includes("Простите, вы ничего не говорили о сиропе")) {
                        showDialogBox("Денис", cleanText)
                        showTwoHandsImage()
                        updateCharacterMood("angry")
                    } else {
                        showDialogBox("Денис", cleanText)

                        // Показываем руки бариста, если говорит бариста и не активирована сцена с кофе
                        if (!coffeeSceneActive) {
                            baristaHands.classList.add("active")
                        } else {
                            baristaHands.classList.remove("active")
                        }

                        setTimeout(() => {
                            showDialogBox(
                                "Алексей",
                                currentDialogue[currentDialogStep].guestResponse,
                            )

                            // Скрываем руки бариста, когда говорит гость
                            baristaHands.classList.remove("active")

                            // Reset the flag when moving to the next dialog step
                            if (coffeePickupPhraseShown && !coffeeSceneActive) {
                                coffeePickupPhraseShown = false
                                updateCharacterMood() // Restore normal emotion logic
                            }

                            if (isLast) {
                                setTimeout(() => {
                                    showNotification("Диалог окончен", () => {
                                        dialogScreen.classList.remove("active");
                                        document.querySelector('.completion-panel').classList.add("active");
                                        resetDialog();
                                    })
                                }, 2000)
                            } else {
                                setTimeout(() => {
                                    this.classList.remove("correct")
                                    currentDialogStep++
                                    loadDialogStep(currentDialogStep)
                                }, 2000)
                            }
                        }, 4000)
                    }
                } else {
                    this.classList.add("incorrect")
                    // Show sad emotion when answer is incorrect
                    updateCharacterMood("sad")

                    updateSatisfactionLevel(-10)
                    if (satisfactionLevel <= 0) {
                        showNotification("Уровень удовлетворенности гостя достиг минимума. Диалог не пройден.", () => {
                            dialogScreen.classList.remove("active")
                            panels[3].classList.add("active")
                            resetDialog()
                            this.classList.remove("incorrect")
                        })
                        return
                    }
                    const hint = this.getAttribute("data-hint")
                    showNotification(hint || "Неверный ответ, начинаем диалог заново", () => {
                        // Сохраняем текущего гостя
                        const currentGuest = currentDialogue === alexeyDialogue ? "alexey" : "other";

                        // Мягкий сброс без полной перезагрузки
                        currentDialogStep = 0;
                        satisfactionLevel = 20;
                        progressFill.style.width = `${satisfactionLevel}%`;

                        // Восстанавливаем аудио
                        dialogAudio.currentTime = 0;
                        dialogAudio.play();

                        // Восстанавливаем сцену
                        characterGuest.classList.remove("angry", "sad", "excited");
                        characterGuest.classList.add("neutral");
                        baristaHands.classList.add("active");
                        coffeeHand.classList.remove("active");
                        twoHands.classList.remove("active");
                        speakerName.textContent = "";
                        dialogText.textContent = "";

                        // Перезагружаем первый шаг диалога
                        loadDialogStep(0);

                        notification.classList.remove("active");
                        this.classList.remove("incorrect");
                    });
                }
            })
        })
    }

    // Функция активации сцены с кофе
    function activateCoffeeSceneMode() {
        coffeeSceneActive = true

        // Перемещаем персонажа вправо с плавной анимацией
        characterGuest.classList.add("coffee-scene")

        // Move the cash register to the left in coffee scene
        cashRegister.classList.add("coffee-scene")
        paymentTerminal.classList.add("coffee-scene")

        // Скрываем руки бариста
        baristaHands.classList.remove("active")

        // Показываем руку с кофе с плавной анимацией
        coffeeHand.classList.add("active")
    }

    // Функция настройки диалога для выбранного гостя
    function setupDialogForGuest(guestType) {
        if (characterGuestName) {
            characterGuestName.textContent = "Алексей"
        }

        // Сбрасываем сцену с кофе, если она была активна
        coffeeSceneActive = false
        characterGuest.classList.remove("coffee-scene")
        coffeeHand.classList.remove("active")
        twoHands.classList.remove("active")
        cashRegister.classList.remove("coffee-scene")
        paymentTerminal.classList.remove("coffee-scene")

        // Устанавливаем нейтральное настроение гостя в начале диалога
        updateCharacterMood("neutral")

        satisfactionLevel = 20
        updateSatisfactionLevel(35)
        currentDialogStep = 0
        coffeePickupPhraseShown = false
        angryGuestShown = false

        currentDialogue = alexeyDialogue
    }

    // Загрузка шага диалога
    function loadDialogStep(step) {
        if (step >= currentDialogue.length) return
        const dialogStep = currentDialogue[step]
        questionHeader.textContent = dialogStep.question
        const answerOptionsContainer = document.querySelector(".answer-options")
        answerOptionsContainer.innerHTML = ""
        dialogStep.options.forEach((option) => {
            const button = document.createElement("button")
            button.className = "answer-option"
            button.textContent = option.text
            button.setAttribute("data-correct", option.correct)
            if (option.hint) button.setAttribute("data-hint", option.hint)
            if (option.satisfactionChange) button.setAttribute("data-satisfaction-change", option.satisfactionChange)
            if (option.isLast) button.setAttribute("data-last", "true")
            if (option.activateCoffeeScene) button.setAttribute("data-activate-coffee-scene", "true")
            if (option.showTwoHands) button.setAttribute("data-show-two-hands", "true")
            answerOptionsContainer.appendChild(button)
        })
        setupAnswerOptions()
    }

    // Обновленная функция для смены эмоций персонажа с плавной анимацией
    function updateCharacterMood(forcedMood = null) {
        // Удаляем все классы эмоций
        characterGuest.classList.remove("angry", "excited", "neutral", "sad")

        // Если настроение задано принудительно, используем его
        // Иначе используем нейтральное настроение по умолчанию
        const mood = forcedMood || "neutral"

        // Применяем соответствующий класс
        characterGuest.classList.add(mood)
    }

    // Обновляем функцию updateSatisfactionLevel для изменения ширины вместо высоты
    function updateSatisfactionLevel(change) {
        satisfactionLevel += change
        satisfactionLevel = Math.max(0, Math.min(100, satisfactionLevel))
        progressFill.style.width = `${satisfactionLevel}%` // Меняем height на width
    }

    // Отображение уведомления с обёрткой callback, которая сразу закрывает окно уведомления
    function showNotification(text, callback) {
        notificationText.textContent = text
        notification.classList.add("active")
        notificationBtn.onclick = () => {
            notification.classList.remove("active")
            if (callback) callback()
        }
    }

    // Обновляем функцию resetDialog для сброса ширины вместо высоты
    function resetDialog() {
        currentDialogStep = 0
        satisfactionLevel = 20
        progressFill.style.width = `${satisfactionLevel}%` // Меняем height на width
        questionHeader.textContent = ""
        const answerOptionsContainer = document.querySelector(".answer-options")
        answerOptionsContainer.innerHTML = ""
        dialogBox.classList.remove("active")
        speakerName.textContent = ""
        dialogText.textContent = ""
        notification.classList.remove("active")
        baristaHands.classList.remove("active")
        coffeeHand.classList.remove("active")
        twoHands.classList.remove("active")

        // Reset cash register and terminal positions
        cashRegister.classList.remove("coffee-scene")
        paymentTerminal.classList.remove("coffee-scene")

        // Удаляем все модальные окна, если они есть
        const complaintModals = document.querySelectorAll(".complaint-modal")
        complaintModals.forEach((modal) => {
            document.body.removeChild(modal)
        })

        // Сбрасываем все классы эмоций и сцены
        characterGuest.classList.remove("angry", "excited", "coffee-scene", "sad", "neutral")

        coffeeSceneActive = false
        coffeePickupPhraseShown = false
        angryGuestShown = false
        notificationBtn.onclick = null

        dialogAudio.pause();
        dialogAudio.currentTime = 0;
    }
})

let typingTimer;                 // нужен, чтобы останавливать предыдущий набор

function typeText(el, text, speed = 35, onFinish = () => { }) {
    if (typingTimer) clearTimeout(typingTimer); // отменяем предыдущую анимацию
    el.textContent = "";
    el.classList.add("typing");

    let i = 0;
    (function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i++);
            typingTimer = setTimeout(type, speed);
        } else {
            el.classList.remove("typing");      // убираем каретку
            onFinish();
        }
    })();
}

function shuffleOptions(options) {
    // Создаем копию массива
    const shuffled = [...options];

    // Перемешиваем массив
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

