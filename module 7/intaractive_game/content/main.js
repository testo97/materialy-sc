/* ------------------------------------------------------------------ *
 *  main.js ― полная актуальная версия                                *
 * ------------------------------------------------------------------ */

/* ---------- 0. Запуск игры ---------- */
const startBtn = document.getElementById('startBtn');
const startModal = document.getElementById('startModal');
const gameBlock = document.querySelector('.game');

startBtn.addEventListener('click', () => {
    startModal.classList.add('hidden');     // убираем заставку
    gameBlock.classList.remove('disabled'); // активируем игру
    loadRound();                            // загружаем 1-й раунд
});

/* ---------- 1. Данные раундов ---------- */
const rounds = [
    {
        task: 'Большой капучино здесь',
        required: ['spoon-cocktail', 'mag-med', 'salfetka']
    },
    {
        task: 'Большой латте здесь + чизкейк',
        required: ['spoon-cocktail', 'mag-big', 'fork-desert', 'salfetka', 'podnos', 'dish-desert']
    },
    {
        task: 'Большой капучино и маленький американо здесь + две конфеты ручной работы',
        required: ['mag-med', 'spoon-cocktail', 'fork-desert',
            'mag-tea-dish', 'spoon-tea', 'fork-desert', '2salfetka', 'dish-desert', 'dish-desert', 'podnos']
    },
    {
        task: 'Чай облепиховый здесь на две персоны + рап + конфета + макарун + чизкейк',
        required: ['mag-tea-dish', 'mag-tea-dish',
            'spoon-tea', 'spoon-tea', 
            'fork-desert', 'fork-desert', '2salfetka', 'podnos', 'dish-desert', 'dish-desert', 'dish-desert', 'teapot']
    },
    {
        task: 'Чай облепиховый здесь на две персоны + Большой капучино с собой + яблочный пирог + две конфеты + каша рисовая',
        required: ['mag-tea-dish', 'mag-tea-dish',
            'spoon-tea', 'spoon-tea',
            'fork-desert', 'fork-desert', 'fork-desert',
            'spoon-dinnary', 'podnos', '3salfetka', 'dish-desert', 'dish-desert', 'dish-desert', 'dish-deep', 'teapot', 'stakan-med']
    },
    {
        task: 'С собой пончик, круассан сливочный и большой капучино',
        required: ['package-sm', 'package-med', '2salfetka', 'package-big', 'stakan-med']
    },
    {
        task: 'С собой пончик, конфета, чизкейк и два больших капучино',
        required: ['package-sm', 'package-sm', 'box-desert', '3salfetka', 'package-big', '2-podstavka', 'fork-soboy', 'fork-soboy', 'stakan-med', 'stakan-med']
    },
    {
        task: 'С собой медовик, чизкейк, две конфеты и три больших капучино',
        required: ['box-desert', 'box-desert', 'package-sm', 'package-big', '3salfetka', 'fork-soboy', 'fork-soboy', 'fork-soboy', '4-podstavka', 'stakan-med', 'stakan-med', 'stakan-med']
    }
];

/* ---------- 2. Служебные ссылки ---------- */
let current = 0;                         // номер текущего раунда
let completed = 0;                       // сколько раундов уже пройдено
const chosen = new Map();                // Map<id, qty>

const taskText = document.querySelector('.task-block p');
const hintMessage = document.querySelector('.task-block .hint-message');
const dropZone = document.querySelector('.drop-zone');
const placeholder = dropZone.querySelector('.placeholder');

const successModal = document.getElementById('successModal');
const continueBtn = document.getElementById('continueBtn');

/* индикатор прогресса ----------------------------------------------- */
const progressCurrent = document.getElementById('progressCurrent');
const progressDone = document.getElementById('progressDone');
const progressFill = document.getElementById('progressFill');

document.getElementById('progressTotal').textContent = rounds.length;
document.getElementById('progressTotal2').textContent = rounds.length;

function updateProgress() {
    progressCurrent.textContent = current + 1;
    progressDone.textContent = completed;
    progressFill.style.width = (completed / rounds.length * 100) + '%';
}

/* сообщение о корректировке ----------------------------------------- */
function showHint(text) {
    hintMessage.textContent = text;
    hintMessage.classList.add('show');
}
function hideHint() {
    hintMessage.textContent = '';
    hintMessage.classList.remove('show');
}

/* индикатор нехватки ------------------------------------------------ */
function showMissing() {
    if (!dropZone.querySelector('.missing-block')) {
        const m = document.createElement('div');
        m.className = 'missing-block';
        m.textContent = '?';
        dropZone.appendChild(m);
    }
    // заказ (текст задания) остаётся на месте, сообщение выводим отдельно
    showHint('Кажется здесь чего-то не хватает. Сбрось заказ и начни заново.');
}
function hideMissing() {
    dropZone.querySelector('.missing-block')?.remove();
    hideHint();
}

/* ---------- 3. Загрузка раунда ---------- */
function loadRound() {
    chosen.clear();
    dropZone.innerHTML = '';
    dropZone.appendChild(placeholder);
    dropZone.classList.remove('success', 'error');
    dropZone.querySelector('.missing-block')?.remove();
    taskText.textContent = rounds[current].task;   // всегда показываем заказ
    hideHint();                                     // убираем сообщение о корректировке
    updateProgress();                               // обновляем счётчик прогресса
}

/* ---------- 4. Открытие модалок категорий ---------- */
document.querySelectorAll('.choose-area > .choose-block')
    .forEach(card => {
        const id = card.dataset.modal;
        if (!id) return;
        card.addEventListener('click', () => document.getElementById(id).classList.add('active'));
    });

/* ---------- 5. Работа внутри модалок ---------- */
document.querySelectorAll('.modal-values').forEach(modal => {
    /* закрываем по клику вне панели */
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.classList.remove('active');
    });

    /* выбор товара */
    modal.querySelectorAll('.choose-block').forEach(item => {
        item.addEventListener('click', e => {
            e.stopPropagation();
            const id = item.dataset.item;
            if (!id) return;

            addToBasket(item.cloneNode(true));              // кладём копию карточки
            chosen.set(id, (chosen.get(id) || 0) + 1);           // увеличиваем счётчик
            modal.classList.remove('active');
        });
    });
});

/* ---------- 6. Добавление карточки в корзину ---------- */
function addToBasket(card) {
    card.classList.add('chosen');

    const remove = document.createElement('span');
    remove.className = 'remove';
    remove.innerHTML = '&times;';
    remove.addEventListener('click', () => {
        const id = card.dataset.item;
        const left = (chosen.get(id) || 1) - 1;
        left ? chosen.set(id, left) : chosen.delete(id);
        card.remove();
        if (!chosen.size) dropZone.appendChild(placeholder);
    });

    card.appendChild(remove);
    dropZone.appendChild(card);
    if (placeholder.parentNode) placeholder.remove();

    hideMissing();                        // пользователь продолжил выбор ― убираем “?”
}

/* ---------- 7. Сброс заказа ---------- */
document.querySelector('.button-container a:first-child')
    .addEventListener('click', loadRound);

/* ---------- 8. Проверка заказа ---------- */
function counts(arr) {
    return arr.reduce((m, id) => (m[id] = (m[id] || 0) + 1, m), {});
}

document.querySelector('.button-container a:last-child')
    .addEventListener('click', () => {

        const need = counts(rounds[current].required);    // {id: qty}
        const have = Object.fromEntries(chosen);          // Map → object

        let ok = true;

        dropZone.querySelectorAll('.wrong')
            .forEach(el => el.classList.remove('wrong'));

        /* 8.1 лишние предметы или лишнее кол-во */
        Object.entries(have).forEach(([id, qty]) => {
            const must = need[id] ?? 0;                   // 0 если не нужен

            if (must === 0) {                               // предмета быть не должно
                ok = false;
                dropZone.querySelectorAll(`.chosen[data-item="${id}"]`)
                    .forEach(el => el.classList.add('wrong'));
                return;
            }

            if (qty > must) {                               // лишние копии
                ok = false;
                dropZone.querySelectorAll(`.chosen[data-item="${id}"]`)
                    .forEach((el, i) => { if (i >= must) el.classList.add('wrong'); });
            }
        });

        /* 8.2 недостача */
        Object.entries(need).forEach(([id, req]) => {
            if ((have[id] || 0) < req) ok = false;
        });

        dropZone.classList.toggle('success', ok);
        dropZone.classList.toggle('error', !ok);

        if (ok) {
            hideMissing();
            completed = current + 1;          // раунд пройден
            updateProgress();
            successModal.classList.remove('hidden');
        } else {
            /* заказ остаётся на экране, дополнительно показываем подсказку */
            const haveLess = Object.entries(need)
                .some(([id, q]) => (have[id] || 0) < q);

            if (haveLess) {
                showMissing();                // нехватка → “?” + сообщение
            } else {
                dropZone.querySelector('.missing-block')?.remove();
                showHint('Кажется, здесь есть лишние предметы. Сбрось заказ и начни заново.');
            }
        }
    });

/* ---------- 9. Переход к следующему раунду ---------- */
continueBtn.addEventListener('click', () => {
    successModal.classList.add('hidden');

    if (current + 1 >= rounds.length) {
        // Показываем финальную панель
        const finalPanel = document.createElement('div');
        finalPanel.className = 'modal-mask';
        finalPanel.id = 'finalModal';
        finalPanel.innerHTML = `
            <div class="panel active">
                <p class="panel-text">
                    Поздравляю! Вы успешно справились с темой сборки заказов
                </p>
                <button class="next-btn" id="finalBtn">На главную</button>
            </div>
        `;
        document.querySelector('.page-container').appendChild(finalPanel);

        // Обработчик кнопки "На главную"
        document.getElementById('finalBtn').addEventListener('click', () => {
            sendScore();
            window.top.location.href = "https://sc-learn.ru/my/courses.php";
        });
    } else {
        current++;
        loadRound();
    }
});