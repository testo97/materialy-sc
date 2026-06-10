document.addEventListener("DOMContentLoaded", () => {
    // Панели для экранов 1–4 (экраны с классом .panel)
    const panels = document.querySelectorAll(".panel")
    // Экран с гостями (5‑й экран) – отдельный блок, не имеющий класс panel
    const guestScreen = document.querySelector(".guest-screen")
    const dialogScreen = document.querySelector(".dialog")
    const nextBtns = document.querySelectorAll(".next-btn")
    const backBtns = document.querySelectorAll(".back-btn")
    const guests = document.querySelectorAll(".guest")
    const startDialogBtn = document.getElementById("start-dialog-btn")
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
        window.top.location.href = "https://sc-learn.ru/mod/page/view.php?id=390";
    });
    let completedDialogs = {
        alexey: false,
        galina: false,
        tamara: false
    };

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
    let selectedGuest = null
    let selectedGuestName = ""
    let selectedGuestImage = ""
    let currentDialogStep = 0
    let satisfactionLevel = 20 // Начальный уровень удовлетворенности (в процентах)
    let currentDialogue = [] // Текущий диалог в зависимости от выбранного гостя
    let coffeeSceneActive = false // Флаг для отслеживания активации сцены с кофе
    let coffeePickupPhraseShown = false // Флаг для отслеживания показа фразы с кофе
    let angryGuestShown = false // Флаг для отслеживания показа злого гостя

    // Сценарий диалога для первого гостя (Алексей)
    const alexeyDialogue = [
        {
            question: "Поприветствуйте гостя",
            options: shuffleOptions([
                { text: "Добрый день! Что для вас приготовить?", correct: true }
            ]),
            guestResponse: "Капучино",
            speakerName: "Денис",
            guestName: "Алексей",
        },
	{
            question: "О чем спросить гостя?",
            options: shuffleOptions([
                { text: "Подскажите, пожалуйста, «здесь» или «с собой»?", correct: true },
                {
                    text: "Подскажите, пожалуйста, какого объема: маленький или большой?",
                    correct: false,
                    hint: "Это неверный вопрос. Сначала важно уточнить способ сборки заказа",
                },
                {
                    text: "Подскажите, пожалуйста, нужен ли сироп?",
                    correct: false,
                    hint: "Это неверный вопрос. Сначала важно уточнить объем",
                },
            ]),
            guestResponse: "С собой",
            speakerName: "Денис",
            guestName: "Алексей",
        },
        {
            question: "О чем спросить гостя дальше?",
            options: shuffleOptions([
                { text: "Подскажите, пожалуйста, какого объема: маленький или большой?", correct: true },
                {
                    text: "Подскажите, пожалуйста, нужен ли сироп?",
                    correct: false,
                    hint: "Это неверный вопрос. Сначала важно уточнить объем",
                },
                {
                    text: "Вам приготовить кофе с собой или на месте?",
                    correct: false,
                    hint: "Это неверный вопрос. не нужно спрашивать про это повторно",
                }
            ]),
            guestResponse: "Угу.",
            speakerName: "Денис",
            guestName: "Алексей",
        },
        {
            question: "Что нужно сделать?",
            options: shuffleOptions([
                { text: "Повторите, пожалуйста, еще раз, какой объем напитка вам нужен?", correct: true },
                {
                    text: "Гость ,вероятно, нервничает, что я задаю уточняющие вопросы. Больше не буду ни о чем спрашивать.",
                    correct: false,
                    hint: "Неверно. Чем меньше уточняем - тем меньше вероятность правильно обслужить гостя и дать ему именно то, что он хочет заказать.",
                },
                {
                    text: "Подождать, пока гость сформулирует ответ на мой вопрос.",
                    correct: false,
                    hint: "Это неверно. Гость может не понять, почему вы молчите.",
                }
            ]),
            guestResponse: "Большой.",
            speakerName: "Денис",
            guestName: "Алексей",
        },
        {
            question: "Что спросить дальше?",
            options: shuffleOptions([
                { text: "Добавить ли сироп, корицу или сахар?", correct: true },
                {
                    text: "Добавить что-то к напитку?",
                    correct: false,
                    hint: "Неверно. Мы должны предложить выбор из конкретных позиций: сахар, корица или сироп",
                },
                {
                    text: "Возможно, вы хотели бы попробовать наши круассаны к кофе? Их только приготовили.",
                    correct: false,
                    hint: "Нет. В нашей сети запрещены допродажи каких-либо позиций к выбору гостя.",
                }
            ]),
            guestResponse: "Нет.",
            speakerName: "Денис",
            guestName: "Алексей",
        },
        {
            question: "Что сказать?",
            options: shuffleOptions([
                {
                    text: "Пожалуйста, ваш большой капучино, хорошего дня!",
                    correct: true,
                    satisfactionChange: 10,
                    activateCoffeeScene: true,
                },
                {
                    text: "Заберите капучино большой. До свидания.",
                    correct: false,
                    satisfactionChange: -20,
                    activateCoffeeScene: true,
                },
                {
                    text: "Большой капучино, приятного.",
                    correct: false,
                    satisfactionChange: -20,
                    activateCoffeeScene: true
                }
            ]),
            guestResponse: "Не понял, я же просил с сиропом, тут сиропа нет.",
            speakerName: "Денис",
            guestName: "Алексей",
        },
        {
            question: "Что ответить?",
            options: shuffleOptions([
                {
                    text: "Если бы вы сказали о сиропе, я бы обязательно его добавил. Но увы, вы ничего про него не сказали. Все еще добавить сироп?",
                    correct: false,
                    hint: "Неверно. Мы никогда не спорим с гостем. Наша главная задача - это безопасность и лояльность гостей.",
                },
                {
                    text: "Да, действительно. Я приготовил для вас большой капучино без сиропа. Кажется, я не расслышал. Сейчас обязательно добавим сироп! Минуту.",
                    correct: true,
                },
                {
                    text: "Простите, вы ничего не говорили о сиропе. Я точно помню, можем даже по камерам посмотреть.",
                    correct: false,
                    hint: "Неверно. Мы никогда не спорим с гостем. Наша главная задача - это безопасность и лояльность гостей.",
                    showTwoHands: true,
                }
            ]),
            guestResponse: "Теперь точно с сиропом?",
            speakerName: "Денис",
            guestName: "Алексей",
        },
        {
            question: "Что ответить?",
            options: shuffleOptions([
                {
                    text: "Ну конечно! Вы сомневаетесь во мне? Если бы вы сказали сразу, ваши капучино был бы уже давно готов.",
                    correct: false,
                    hint: "Спорить с гостем недопустимо. Мы всегда должны оставаться доброжелательны.",
                },
                {
                    text: "Ну естественно! Как же я мог вас подвести дважды!",
                    correct: false,
                    hint: "Неверно. Сарказмы при общении с гостем недопустимы",
                },
                {
                    text: "Да-да, конечно. Ваш большой капучино с сиропом. Хорошего дня! Приходите еще.",
                    correct: true,
                    isLast: true,
                }
            ]),
            guestResponse: "Спасибо, до свидания!",
            speakerName: "Денис",
            guestName: "Алексей",
        },
    ];

    // Сценарий диалога для второго гостя (Галина)
    const galinaDialogue = [
        {
            question: "Поприветствуйте гостя",
            options: shuffleOptions([
                { text: "Добрый день! Что для вас приготовить?", correct: true }
            ]),
            guestResponse: "Авторский чаи и побыстрее! Некогда ждать!",
            speakerName: "Денис",
            guestName: "Галина",
        },
        {
            question: "Как ответить?",
            options: shuffleOptions([
                {
                    text: "Должен вас предупредить, что приготовление авторского чая занимает чуть больше времени, чем обычного. Готовы ли вы подождать 7-8 минут?",
                    correct: true,
                },
                {
                    text: "Можно вас попросить не хамить? Я нахожусь на рабочем месте. Мне неприятен ваш тон",
                    correct: false,
                    hint: "Это неверно. Мы не вступаем в спор с гостем. Для нас важна лояльность гостя.",
                },
                {
                    text: "Ну я же не девочка на побегушках. Выполним побыстрее, но в меру наших возможностей",
                    correct: false,
                    hint: "Это неверно. Мы не вступаем в спор с гостем. Для нас важна лояльность гостя.",
                }
            ]),
            guestResponse: "Конечно нет!! Давайте латте!",
            speakerName: "Денис",
            guestName: "Галина",
        },
{
            question: "что спросить дальше?",
            options: shuffleOptions([
                {
                    text: "Постараюсь выполнить ваш заказ как можно быстрее. Подскажите пожалуйста: здесь или с собой?",
                    correct: true,
                },
                {
                    text: "Постараюсь выполнить ваш заказ как можно быстрее. Какой объем для вас: маленький или большой?",
                    correct: false,
                    hint: "Это неверно. сначала важно уточнить про способ выдачи заказа",
                },
                {
                    text: "Стоит попросить гостя не повышать голос и не торопить: спешка только ухудшит качество приготовления блюд",
                    correct: false,
                    hint: "Это неверно. Мы не вступаем в спор с гостем. Для нас важна лояльность гостя.",
                }
            ]),
            guestResponse: "Ну конечно с собой! а так не понятно, что я тороплюсь?",
            speakerName: "Денис",
            guestName: "Галина",
        },
        {
            question: "Что следует сделать/сказать?",
            options: shuffleOptions([
                {
                    text: "Да, конечно, извините за задержку. Какой объем для вас: маленький или большой?",
                    correct: true,
                },
                {
                    text: "Стоит попросить гостя не повышать голос и не торопить: спешка только ухудшит качество приготовления блюд",
                    correct: false,
                    hint: "Это неверно. Мы не вступаем в спор с гостем. Для нас важна лояльность гостя.",
                },
                {
                    text: "Следует позвать менеджера, так как это явный конфликтный случай и с этим должен разбираться менеджер/управляющий",
                    correct: false,
                    hint: "Это неверно. Мы не вступаем в спор с гостем. Для нас важна лояльность гостя.",
                }
            ]),
            guestResponse: "Маленький",
            speakerName: "Денис",
            guestName: "Галина",
        },
        {
            question: "О чем следует спросить далее?",
            options: shuffleOptions([
                { text: "Добавить ли сироп, сахар, корицу?", correct: true },
                {
                    text: "Нужна ли вам крышка или трубочка?",
                    correct: false,
                    hint: 'Данный вопрос мы не задаем. При выдаче заказа "С собой" мы лишь указываем гостю, где находится сервис-бар, чтобы он при необходимости взял нужные ему приборы',
                },
                {
                    text: "Ни о чем не стоит спрашивать. Гость спешит",
                    correct: false,
                    hint: "Это неверно. Даже если гость спешит, мы должны обслужить его качественно и спросить, в первую очередь, о необходимых ему добавках к кофе: корице, сахаре, сиропе",
                }
            ]),
            guestResponse: "Корицу и сироп. Еще долго?",
            speakerName: "Денис",
            guestName: "Галина",
        },
        {
            question: "Как ответить?",
            options: shuffleOptions([
                {
                    text: "Маленький латте с корицей и сиропом. 240 рублей, пожалуйста, прикладывайте карту.",
                    correct: true
                },
                {
                    text: "Еще 5 минут. Вы еще не оплатили заказ. Поэтому я не могу начать его приготовление",
                    correct: false,
                    hint: "Нет, это не совсем вежливо и не ускоряет процесс обслуживания гостя",
                },
                {
                    text: "Пожалуйста, давайте оплатим заказ сначала. Потом я сделаю его как можно быстрее.",
                    correct: false,
                    hint: "Нет, это не совсем вежливо и не ускоряет процесс обслуживания гостя",
                }
            ]),
            guestResponse: "Господи, куда тут прикладывать к этому вашему терминалу!!!",
            speakerName: "Денис",
            guestName: "Галина",
        },
        {
            question: "Как ответить гостю?",
            options: shuffleOptions([
                {
                    text: "Вот сюда, пожалуйста.",
                    correct: true
                },
                {
                    text: "Будьте повнимательнее. Это поможет мне приготовить для вас напиток намного быстрее",
                    correct: false,
                    hint: "Неверно. Мы не вступаем в споры с гостем и уж тем более не поучаем его.",
                },
                {
                    text: "Он прямо перед вами.",
                    correct: false,
                    hint: "Нет, это не совсем вежливо. Важно вежливо показать гостю, где находится терминал, желательно жестом.",
                }
            ]),
            guestResponse: "ну, оплатила, сколько еще ждать??",
            speakerName: "Денис",
            guestName: "Галина",
        },
        {
            question: "Оплата прошла. Что делать дальше?",
            options: shuffleOptions([
                {
                    text: "Ваш латте с корицей и сиропом. Хорошего дня!",
                    correct: true,
                    isLast: true,
                },
                {
                    text: "Можно, наконец, порадоваться, что сложный гость ушел",
                    correct: false,
                    hint: 'Неверно. В конце выполнения заказа важно пожелать гостю "Хорошего дня" или сказать "До свидания", вне зависимости от того, как складывался разговор между вами',
                },
                {
                    text: "Время рассказать о таком сложном госте коллеге. Надо выплеснуть негативные эмоции и возвращаться к работе",
                    correct: false,
                    hint: "Неверно. Мы не обсуждаем гостей с коллегами в течение смены.",
                }
            ]),
            guestResponse: "Наконец-то!",
            speakerName: "Денис",
            guestName: "Галина",
        },
    ];

    const TamaraDialogue = [
        {
            question:
                'Бариста обслужил Тамару Ивановну с внуком. Они взяли заказ "с собой". Твоя задача - грамотно отдать заказ. Что сделаешь/скажешь в первую очередь?',
            options: shuffleOptions([
                { text: "Проверю комплектацию заказа, чтобы удостовериться, что заказ собран корректно", correct: true },
                {
                    text: "Заказ №17 готов!",
                    correct: false,
                    hint: "Неверно. Прежде нужно убедиться, что заказ собран корректно",
                },
                {
                    text: "Нужен ли вам сахар или корица в напиток?",
                    correct: false,
                    hint: "Неверно. Данный вопрос неуместно задавать при выдаче заказа. Об этом стоит уточнить при оформлении заказа , до момента оплаты.",
                },
            ]),
            speakerName: "Денис",
            guestResponse: "...",
            guestName: "Тамара Ивановна",
            emotion: "neutral",
        },
        {
            question: "Что следует сделать/сказать дальше?",
            options: shuffleOptions([
                {
                    text: "Заказ №17 готов",
                    correct: true,
                },
                {
                    text: "Все готово, приятного аппетита!",
                    correct: false,
                    hint: "Это неверно. Гость, чей заказ готов, вряд ли поймет, что готов именно его заказ.",
                },
                {
                    text: "Женщина с внуком, ваш заказ №17 готов!",
                    correct: false,
                    hint: 'Это неверно и нетактично - использовать обращения "женщина", "внук", "девушка" и т.д.',
                },
            ]),
            guestResponse: "...",
            speakerName: "Денис",
            guestName: "Тамара Ивановна",
            emotion: "neutral",
        },
        {
            question: "Никто не подходит. Хотя ты видишь, что гость, который делал заказ, стоит рядом.",
            options: shuffleOptions([
                { text: "Латте с сиропом и малиновый тарт, пожалуйста", correct: true },
                {
                    text: "Женщина, кажется вы заказывали тарт и латте? Ваш заказ готов!",
                    correct: false,
                    hint: "Это неверно и не тактично. Мы не используем обращения, которые подчеркивают пол, возраст или родственные отношения.",
                },
                {
                    text: 'Повторить громче: "Заказ №17 готов!"',
                    correct: false,
                    hint: "Это неверно. В случае, если гость не подходит за заказом, номер которого мы назвали, стоит указать, какие основные позиции в заказе. Скорее всего, что гость забыл номер своего заказа.",
                },
            ]),
            guestResponse: "...",
            speakerName: "Денис",
            guestName: "Тамара Ивановна",
            emotion: "surprised",
        },
        {
            question:
                "Гость подходит, готов забрать заказ. В чеке данного заказа ты не видишь никаких пояснений. О чем стоит спросить гостя?",
            options: shuffleOptions([
                {
                    text: "Не хотите ли попробовать наш новый сэндвич?",
                    correct: false,
                    hint: "Неверно. Согласно политике нашего заведения, мы не занимаемся допродажами каких-либо позиций.",
                },
                { text: "Нужно ли вам что-то дополнительно?", hint: "Вопрос неточный и может поставить в ступор гостя. Он может не понять, о чем вы спрашиваете.", correct: false },
                { text: "Нужны ли приборы?", correct: true },
            ]),
            guestResponse: "Нет спасибо.",
            speakerName: "Денис",
            guestName: "Тамара Ивановна",
            emotion: "neutral",
        },
        {
            question: "Как стоит ответить далее?",
            options: shuffleOptions([
                { text: "Хорошего дня.", correct: true, isLast: true, activateCoffeeScene: true },
                {
                    text: "Бон аппети!",
                    correct: false,
                    hint: 'Неверно. Мы желаем хорошего дня/вечера при прощании с гостем. Также допустим вариант "До свидания!"',
                },
                {
                    text: "До встречи!",
                    correct: false,
                    hint: 'Неверно. Мы желаем хорошего дня/вечера при прощании с гостем. Также допустим вариант "До свидания!"',
                },
            ]),
            guestResponse: "Ой, спасибо большое, до свидания",
            speakerName: "Денис",
            guestName: "Тамара Ивановна",
            emotion: "angry",
        },
    ]

    // Изначально скрываем экраны гостей и диалога, а также окна уведомлений
    guestScreen.classList.remove("active")
    dialogScreen.classList.remove("active")
    dialogBox.classList.remove("active")
    notification.classList.remove("active")

    // Обработка нажатий на кнопки "Далее"
    nextBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (panels[currentPanel] && panels[currentPanel].classList.contains("active")) {
                panels[currentPanel].classList.remove("active")
                if (currentPanel === 3) {
                    guestScreen.classList.add("active")
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
                guestScreen.classList.add("active")
                dialogAudio.pause();
                dialogAudio.currentTime = 0;
                resetDialog()
            } else if (guestScreen.classList.contains("active")) {
                guestScreen.classList.remove("active")
                panels[3].classList.add("active")
            } else {
                panels[currentPanel].classList.remove("active")
                if (currentPanel > 0) currentPanel--
                panels[currentPanel].classList.add("active")
            }
        })
    })

    // Выбор гостя
    guests.forEach((guest) => {
        guest.addEventListener("click", () => {
            const guestId = guest.getAttribute("data-guest")
            // Снимаем выделение со всех гостей
            guests.forEach((g) => g.classList.remove("selected"))
            guest.classList.add("selected")
            selectedGuest = guestId
            console.log(selectedGuest)
            selectedGuestName = guest.getAttribute("data-name")
            selectedGuestImage = guest.getAttribute("data-image")
            startDialogBtn.disabled = false
        })
    })

    // Начало диалога: сбрасываем состояние и запускаем диалог для выбранного гостя
    if (startDialogBtn) {
        startDialogBtn.addEventListener("click", () => {
            if (selectedGuest) {
                // Перед запуском нового диалога сбрасываем состояние
                resetDialog()
                guestScreen.classList.remove("active")
                dialogScreen.classList.add("active")
                setupDialogForGuest(selectedGuest)
                loadDialogStep(0)
                dialogAudio.currentTime = 0;
                dialogAudio.play();
            } else {
                alert("Пожалуйста, выберите гостя для начала диалога")
            }
        })
    }

    // Функция для отображения диалогового окна
    function showDialogBox(speaker, text) {
    speakerName.textContent = speaker;
    typeText(dialogText, text);            
        dialogBox.classList.add("active");

        console.log(selectedGuest)

        if (selectedGuest === "tamara" && currentDialogStep === 0) {
            return; // ничего не показываем на первом шаге у Тамары
        }


    // ────────── Кастомная логика эмоций для Алексея ──────────
        if (selectedGuest === "alexey") {
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
        else if (speaker === currentDialogue[currentDialogStep].guestName 
                 && /Не понял/.test(text)) {
            updateCharacterMood("angry");
            coffeeHand.classList.remove("active");
        }
        // 3) После извинения бариста "Да, действительно. Я приготовил..." — нейтральное настроение
        else if (speaker === "Денис" && /^Да,\s*действительно/.test(text)) {
            updateCharacterMood("neutral");
        }
        // 4) На реплику Алексея "Теперь точно с сиропом?" — грустное настроение
        else if (speaker === currentDialogue[currentDialogStep].guestName 
                 && /Теперь точно с сиропом/.test(text)) {
            updateCharacterMood("sad");
            coffeeHand.classList.add("active");
        }
        // 5) После финальной фразы бариста "Да-да, конечно. Ваш большой капучино с сиропом..." — радостное настроение
        else if (speaker === "Денис" && /^Да-да,\s*конечно/.test(text)) {
            updateCharacterMood("excited");
        }
        }
    else if (selectedGuest === "galina") {
        // Когда гость говорит фразу "Господи, куда тут прикладывать..."
        if (speaker === currentDialogue[currentDialogStep].guestName
            && /Господи,\s*куда\s*тут\s*прикладывать/.test(text)) {
            updateCharacterMood("angry")
        }

        else if (speaker === currentDialogue[currentDialogStep].guestName &&
            /ну,\s*оплатила,\s*сколько\s*еще\s*ждать/.test(text)) {

            // Активируем сцену с кофе
            activateCoffeeSceneMode()
            coffeeHand.classList.remove("active")

            // Скрываем варианты ответа
            const answerOptionsContainer = document.querySelector(".answer-options")
            answerOptionsContainer.style.opacity = "0"
            answerOptionsContainer.style.pointerEvents = "none"

            // Показываем через 1.5 секунды
            setTimeout(() => {
                coffeeHand.classList.add("active")

                answerOptionsContainer.style.opacity = "1"
                answerOptionsContainer.style.pointerEvents = "auto"
            }, 4000)

            updateCharacterMood("sad") // Можно временно нейтральное или sad
        }

        // Когда гость говорит "Наконец-то!"
        else if (speaker === currentDialogue[currentDialogStep].guestName &&
            currentDialogStep === 6) {
            updateCharacterMood("excited")
        }
        }
    if (selectedGuest === "tamara") {
            console.log(characterGuest.classList)

        }
        
    // ────────────────────────────────────────────────────────

    // Существующая проверка на "неправильные" ответы — оставляем без изменений,
    // она как раз переводит гостя в грустное состояние при неверном выборе:
    if (text.includes("Неверный ответ")) {
        updateCharacterMood("sad");
    }

    // Существующая логика для сцены с кофе и модалки — оставляем,
    // но оборачиваем её, чтобы не перекрывать новые настройки для Алексея:
    if (selectedGuest !== "alexey") {
        if (
            (text.includes("Заберите капучино большой. До свидания.") ||
             text.includes("Большой капучино, приятного.") ||
             text.includes("Пожалуйста, ваш большой капучино, хорошего дня!")) &&
            !coffeePickupPhraseShown
        ) {
            updateCharacterMood("angry");
            updateSatisfactionLevel(-15);
            coffeePickupPhraseShown = true;
        }

        if (text.includes("Простите, вы ничего не говорили о сиропе")) {
            showTwoHandsImage();
            updateCharacterMood("angry");
            angryGuestShown = true;
        }
    }

    // Руки бариста показываем по общей логике
    console.log(text)
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

        // Показываем модальное  {
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
            // Возвращаемся в меню выбора
            dialogScreen.classList.remove("active")
            guestScreen.classList.add("active")
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

                if (selectedGuest === "tamara" &&
                    currentDialogue[currentDialogStep].question.includes("Никто не подходит")) {

                    if (isCorrect) {
                        // Анимация перехода Тамары на передний план
                        document.querySelector('.tamara-background').style.display = 'none';
                        document.querySelector('.tamara-foreground').style.display = 'block';

                        // Показываем диалоговое окно после анимации
                        setTimeout(() => {
                            showDialogBox(
                                currentDialogue[currentDialogStep].speakerName,
                                cleanText
                            );
                        }, 500);
                    }
                }


                if (isCorrect) {
                    updateCharacterMood("neutral");
                    this.classList.add("correct")

                    // Apply satisfaction change if specified
                    if (satisfactionChange) {
                        updateSatisfactionLevel(satisfactionChange)
                    } else {
                        updateSatisfactionLevel(10)
                    }

                    if (selectedGuest === "galina") {
                        updateCharacterMood("sad")
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
                        showDialogBox(currentDialogue[currentDialogStep].speakerName, cleanText)
                        showTwoHandsImage()
                        updateCharacterMood("angry")
                    } else {
                        showDialogBox(currentDialogue[currentDialogStep].speakerName, cleanText)

                        // Показываем руки бариста, если говорит бариста и не активирована сцена с кофе
                        if (currentDialogue[currentDialogStep].speakerName === "Денис" && !coffeeSceneActive) {
                            baristaHands.classList.add("active")
                        } else {
                            baristaHands.classList.remove("active")
                        }

                        setTimeout(() => {
                            showDialogBox(
                                currentDialogue[currentDialogStep].guestName,
                                currentDialogue[currentDialogStep].guestResponse,
                            )

                            if (
                                selectedGuest === "tamara" &&
                                currentDialogue[currentDialogStep].guestResponse.includes("Латте с сиропом и малиновый тарт")
                            ) {
                                characterGuest.classList.remove("tamara-scaled")
                            }

                            // Скрываем руки бариста, когда говорит гость
                            baristaHands.classList.remove("active")

                            // Reset the flag when moving to the next dialog step
                            if (coffeePickupPhraseShown && !coffeeSceneActive) {
                                coffeePickupPhraseShown = false
                                updateCharacterMood() // Restore normal emotion logic
                            }

                            if (isLast) {
                                completedDialogs[selectedGuest] = true;
                                const allCompleted = Object.values(completedDialogs).every(val => val);


                                setTimeout(() => {
                                    showNotification("Диалог окончен, перейти к выбору", () => {
                                        if (allCompleted) {
                                            // Если все диалоги пройдены, показываем завершающую панель
                                            dialogScreen.classList.remove("active");
                                            document.querySelector('.completion-panel').classList.add("active");
                                        } else {
                                            // Иначе возвращаем к выбору гостя
                                            dialogScreen.classList.remove("active");
                                            guestScreen.classList.add("active");
                                        }
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

                    if (selectedGuest === "galina") {
                        updateCharacterMood("angry")
                    }

                    updateSatisfactionLevel(-10)
                    if (satisfactionLevel <= 0) {
                        showNotification("Уровень удовлетворенности гостя достиг минимума. Диалог не пройден.", () => {
                            dialogScreen.classList.remove("active")
                            guestScreen.classList.add("active")
                            resetDialog()
                            this.classList.remove("incorrect")
                        })
                        return
                    }
                    const hint = this.getAttribute("data-hint")
                    showNotification(hint || "Неверный ответ, попробуйте еще раз", () => {
                        notification.classList.remove("active")
                        this.classList.remove("incorrect")

                        // Reset emotion based on satisfaction level after notification is closed
                        if (!coffeeSceneActive) {
                        }
                    })
                }
            })
        })
    }

    // Функция активации сцены с кофе
    function activateCoffeeSceneMode() {
        coffeeSceneActive = true

        // Меняем фон на новый с плавной анимацией
        // Фон остается тем же, меняется только положение персонажа

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
            characterGuestName.textContent = selectedGuestName
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

        switch (guestType) {
            case "alexey":
                currentDialogue = alexeyDialogue
                break
            case "galina":
                currentDialogue = galinaDialogue
                break
            case "tamara":
                currentDialogue = TamaraDialogue
                characterGuest.classList.add("tamara-scaled");
                break
            default:
                currentDialogue = alexeyDialogue
        }
        if (guestType === "tamara") {
            // Показываем Тамару на заднем плане в начале диалога
            document.querySelector('.tamara-background').style.display = 'block';
            document.querySelector('.tamara-foreground').style.display = 'none';

            // Убираем стандартного персонажа
            characterGuest.style.display = 'none';
        } 
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

        // Устанавливаем эмоцию для Тамары, если она указана в диалоге
        if (selectedGuest === "tamara" && dialogStep.emotion) {
            updateCharacterMood(dialogStep.emotion)
        }

        if (selectedGuest === "galina") {
            updateCharacterMood("sad")
        }
    }

    // Обновленная функция для смены эмоций персонажа с плавной анимацией
    function updateCharacterMood(forcedMood = null) {
        // Удаляем все классы эмоций
        characterGuest.classList.remove("angry", "excited", "neutral", "sad", "surprised")

        // Удаляем все специальные классы для Галины и Тамары
        characterGuest.classList.remove("galina-angry", "galina-excited", "galina-neutral", "galina-sad")
        characterGuest.classList.remove("tamara-neutral", "tamara-angry", "tamara-surprised")

        // Если настроение задано принудительно, используем его
        // Иначе используем нейтральное настроение по умолчанию
        const mood = forcedMood || "neutral"

        // Применяем соответствующие классы в зависимости от выбранного гостя
        if (selectedGuest === "galina") {
            // Для Галины используем специальные классы
            characterGuest.classList.add(`galina-${mood}`)

            // Добавляем класс для анимации смены эмоций
            characterGuest.classList.add("emotion-transition")

            // Удаляем класс анимации через 500мс
            setTimeout(() => {
                characterGuest.classList.remove("emotion-transition")
            }, 500)
        } else if (selectedGuest === "tamara") {
            const mood = forcedMood || "neutral";

            // Обновляем оба фрейма Тамары
            const tamaraFrames = document.querySelectorAll('.tamara-background, .tamara-foreground');
            tamaraFrames.forEach(frame => {
                // Удаляем все классы эмоций
                frame.classList.remove("tamara-angry", "tamara-neutral", "tamara-surprised");

                // Добавляем нужный класс эмоции
                if (mood === "angry") {
                    frame.style.backgroundImage = 'url("images/tamara_angry.png")';
                } else if (mood === "surprised") {
                    frame.style.backgroundImage = 'url("images/tamara_surprised.png")';
                } else {
                    frame.style.backgroundImage = 'url("images/tamara_happy.png")';
                }

                // Анимация смены эмоций
                frame.classList.add("emotion-transition");
                setTimeout(() => {
                    frame.classList.remove("emotion-transition");
                }, 500);
            });
        } else {
            // Для других гостей используем стандартные классы
            characterGuest.classList.add(mood)
        }
    }

    // Обновляем функцию updateSatisfactionLevel для изменения ширины вместо высоты
    function updateSatisfactionLevel(change) {
        satisfactionLevel += change
        satisfactionLevel = Math.max(0, Math.min(100, satisfactionLevel))
        progressFill.style.width = `${satisfactionLevel}%` // Меняем height на width

        // Эмоции теперь не зависят от уровня удовлетворенности
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
        characterGuest.classList.remove("angry", "excited", "coffee-scene", "sad", "neutral", "surprised")
        characterGuest.classList.remove("galina-angry", "galina-excited", "galina-neutral", "galina-sad")
        characterGuest.classList.remove("tamara-neutral", "tamara-angry", "tamara-surprised")
        document.querySelector('.tamara-background').style.display = 'none';
        document.querySelector('.tamara-foreground').style.display = 'none';
        // Устанавливаем нейтральное настроение
        updateCharacterMood("neutral")

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
