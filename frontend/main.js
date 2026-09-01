/* =========================================================
   HAVEN
   YOUR DAY, IN MOTION.
   Complete Interactive Experience
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       HELPERS
       ===================================================== */

    const $ = selector =>
        document.querySelector(selector);

    const $$ = selector =>
        [...document.querySelectorAll(selector)];


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const intro =
        $("#intro");

    const app =
        $("#app");

    const enterHaven =
        $("#enterHaven");

    const experience =
        $("#experience");

    const experienceInner =
        $("#experienceInner");

    const closeExperience =
        $("#closeExperience");

    const clock =
        $("#clock");

    const todayDate =
        $("#todayDate");

    const dayScore =
        $("#dayScore");

    const traceList =
        $("#traceList");


    /* =====================================================
       DATA
       ===================================================== */

    const STORAGE =
        "haven_v2";


    const defaultData = {

        moments: [],

        learning: [],

        project: "",

        projectWhy: "",

        mood: "",

        reflection: ""

    };


    let data;


    try {

        data =
            JSON.parse(
                localStorage.getItem(STORAGE)
            ) || defaultData;

    } catch {

        data =
            defaultData;

    }


    /* =====================================================
       SAVE
       ===================================================== */

    function save() {

        localStorage.setItem(
            STORAGE,
            JSON.stringify(data)
        );

    }


    /* =====================================================
       CLOCK
       ===================================================== */

    function updateTime() {

        const now =
            new Date();


        if (clock) {

            clock.textContent =
                now.toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                    }
                );

        }


        if (todayDate) {

            todayDate.textContent =
                now
                    .toLocaleDateString(
                        "en-US",
                        {
                            weekday: "long",
                            month: "long",
                            day: "numeric"
                        }
                    )
                    .toUpperCase();

        }

    }


    updateTime();

    setInterval(
        updateTime,
        1000
    );


    /* =====================================================
       INTRO
       ===================================================== */

    setTimeout(() => {

        if (intro) {

            intro.classList.remove(
                "hidden"
            );

        }

    }, 100);


    if (enterHaven) {

        enterHaven.addEventListener(
            "click",
            () => {

                intro.classList.add(
                    "hidden"
                );

                app.classList.add(
                    "visible"
                );

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =====================================================
       MOMENTS
       ===================================================== */

    function addMoment(
        type,
        text
    ) {

        data.moments.push({

            type,

            text,

            time:
                new Date()
                    .toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )

        });


        save();

        renderTrace();

        updateScore();

    }


    function updateScore() {

        if (dayScore) {

            dayScore.textContent =
                data.moments.length;

        }

    }


    /* =====================================================
       TRACE
       ===================================================== */

    function renderTrace() {

        if (!traceList) {
            return;
        }


        if (
            !data.moments ||
            data.moments.length === 0
        ) {

            traceList.innerHTML = `

                <div class="empty-trace">

                    <span>○</span>

                    <p>
                        Your day is empty.
                        Start somewhere.
                    </p>

                </div>

            `;

            return;

        }


        traceList.innerHTML =
            data.moments
                .slice()
                .reverse()
                .map(moment => `

                    <div class="empty-trace">

                        <span>
                            ${symbolFor(moment.type)}
                        </span>

                        <p>
                            <strong>
                                ${escapeHTML(moment.text)}
                            </strong>
                            <br>
                            ${moment.time}
                        </p>

                    </div>

                `)
                .join("");

    }


    function symbolFor(type) {

        const symbols = {

            learn: "✦",

            reset: "○",

            make: "△",

            reflect: "◌"

        };

        return symbols[type] || "·";

    }


    function escapeHTML(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /* =====================================================
       OPEN EXPERIENCE
       ===================================================== */

    function openExperience(
        type
    ) {

        if (!experience) {
            return;
        }


        experienceInner.innerHTML =
            experienceContent(type);


        experience.classList.add(
            "active"
        );


        document.body.style.overflow =
            "hidden";


        activateExperience(
            type
        );

    }


    function closeExperienceNow() {

        experience.classList.remove(
            "active"
        );

        document.body.style.overflow =
            "";

    }


    if (closeExperience) {

        closeExperience.addEventListener(
            "click",
            closeExperienceNow
        );

    }


    experience?.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                experience
            ) {

                closeExperienceNow();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeExperienceNow();

            }

        }
    );


    /* =====================================================
       ACTION BUTTONS
       ===================================================== */

    $$(".action-card")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openExperience(
                        button.dataset.action
                    );

                }
            );

        });


    /* =====================================================
       EXPERIENCE CONTENT
       ===================================================== */

    function experienceContent(
        type
    ) {

        if (type === "learn") {

            return `

                <span class="experience-kicker">
                    01 / LEARN
                </span>

                <h2>
                    Feed your
                    <em>curiosity.</em>
                </h2>

                <p class="experience-description">
                    Choose something you want to understand
                    today. HAVEN will keep it in your personal
                    learning trail.
                </p>

                <input
                    id="learnTopic"
                    placeholder="What are you learning?"
                >

                <button
                    class="experience-primary"
                    id="saveLearning"
                >
                    Add to my day →
                </button>

                <div style="margin-top:45px">

                    <span class="experience-kicker">
                        YOUR TOPICS
                    </span>

                    <div
                        id="learningList"
                        style="margin-top:20px"
                    ></div>

                </div>

            `;

        }


        if (type === "reset") {

            return `

                <span class="experience-kicker">
                    02 / RESET
                </span>

                <h2>
                    Come back to
                    <em>yourself.</em>
                </h2>

                <p class="experience-description">
                    Follow the circle. Inhale as it expands.
                    Exhale as it returns.
                </p>

                <div class="breathing">

                    <div class="breathing-circle">

                        <div>

                            <strong id="breathText">
                                BREATHE
                            </strong>

                            <small
                                id="breathTimer"
                            >
                                30
                            </small>

                        </div>

                    </div>

                </div>

                <div>

                    <span class="experience-kicker">
                        HOW DO YOU FEEL?
                    </span>

                    <div
                        class="option-grid"
                        style="margin-top:20px"
                    >

                        <button class="option"
                            data-mood="Calm">
                            Calm
                        </button>

                        <button class="option"
                            data-mood="Focused">
                            Focused
                        </button>

                        <button class="option"
                            data-mood="Tired">
                            Tired
                        </button>

                        <button class="option"
                            data-mood="Energized">
                            Energized
                        </button>

                    </div>

                </div>

            `;

        }


        if (type === "make") {

            return `

                <span class="experience-kicker">
                    03 / MAKE
                </span>

                <h2>
                    Give an idea
                    <em>somewhere to go.</em>
                </h2>

                <p class="experience-description">
                    Don't worry about the finished version.
                    Start by giving the idea a name.
                </p>

                <input
                    id="projectName"
                    value="${escapeHTML(
                        data.project || ""
                    )}"
                    placeholder="What are you making?"
                >

                <textarea
                    id="projectWhy"
                    placeholder="Why does it matter?"
                >${escapeHTML(
                    data.projectWhy || ""
                )}</textarea>

                <button
                    class="experience-primary"
                    id="saveProject"
                >
                    Start building →
                </button>

                <div
                    id="makeStatus"
                    style="
                        margin-top:25px;
                        color:var(--muted);
                    "
                ></div>

            `;

        }


        return `

            <span class="experience-kicker">
                04 / REFLECT
            </span>

            <h2>
                Notice what
                <em>today became.</em>
            </h2>

            <p class="experience-description">
                A day doesn't need to be extraordinary
                to be meaningful.
            </p>

            <textarea
                id="reflection"
                placeholder="What do you want to remember about today?"
            >${escapeHTML(
                data.reflection || ""
            )}</textarea>

            <button
                class="experience-primary"
                id="saveReflection"
            >
                Save this moment →
            </button>

        `;

    }


    /* =====================================================
       ACTIVATE EXPERIENCE
       ===================================================== */

    function activateExperience(
        type
    ) {


        /* ---------------------------------------------
           LEARN
           --------------------------------------------- */

        if (type === "learn") {

            renderLearning();


            $("#saveLearning")
                ?.addEventListener(
                    "click",
                    () => {

                        const input =
                            $("#learnTopic");

                        const topic =
                            input.value.trim();


                        if (!topic) {

                            input.focus();

                            return;

                        }


                        data.learning.push(
                            topic
                        );


                        save();


                        addMoment(
                            "learn",
                            `Learned about ${topic}`
                        );


                        input.value = "";

                        renderLearning();

                    }
                );

        }


        /* ---------------------------------------------
           RESET
           --------------------------------------------- */

        if (type === "reset") {

            let seconds = 30;

            const timer =
                $("#breathTimer");

            const text =
                $("#breathText");


            const interval =
                setInterval(
                    () => {

                        seconds--;

                        if (timer) {

                            timer.textContent =
                                seconds;

                        }


                        if (seconds <= 0) {

                            clearInterval(
                                interval
                            );

                            if (text) {

                                text.textContent =
                                    "DONE";

                            }

                        }

                    },
                    1000
                );


            $$(".option")
                .forEach(option => {

                    option.addEventListener(
                        "click",
                        () => {

                            $$(".option")
                                .forEach(
                                    item =>
                                        item.classList.remove(
                                            "selected"
                                        )
                                );


                            option.classList.add(
                                "selected"
                            );


                            data.mood =
                                option.dataset.mood;


                            save();


                            addMoment(
                                "reset",
                                `Reset · feeling ${data.mood}`
                            );

                        }
                    );

                });

        }


        /* ---------------------------------------------
           MAKE
           --------------------------------------------- */

        if (type === "make") {

            $("#saveProject")
                ?.addEventListener(
                    "click",
                    () => {

                        const name =
                            $("#projectName")
                                .value
                                .trim();


                        const why =
                            $("#projectWhy")
                                .value
                                .trim();


                        if (!name) {

                            $("#projectName")
                                .focus();

                            return;

                        }


                        data.project =
                            name;

                        data.projectWhy =
                            why;


                        save();


                        addMoment(
                            "make",
                            `Started making ${name}`
                        );


                        const status =
                            $("#makeStatus");


                        if (status) {

                            status.textContent =
                                "Your idea has entered your day. Keep moving it forward.";

                        }

                    }
                );

        }


        /* ---------------------------------------------
           REFLECT
           --------------------------------------------- */

        if (type === "reflect") {

            $("#saveReflection")
                ?.addEventListener(
                    "click",
                    () => {

                        const value =
                            $("#reflection")
                                .value
                                .trim();


                        if (!value) {

                            $("#reflection")
                                .focus();

                            return;

                        }


                        data.reflection =
                            value;


                        save();


                        addMoment(
                            "reflect",
                            value
                        );


                        $("#reflection")
                            .value = "";

                    }
                );

        }

    }


    /* =====================================================
       LEARNING LIST
       ===================================================== */

    function renderLearning() {

        const list =
            $("#learningList");


        if (!list) {
            return;
        }


        if (
            !data.learning ||
            data.learning.length === 0
        ) {

            list.innerHTML =
                `<p style="color:var(--muted)">
                    Nothing here yet. Plant your first topic.
                </p>`;

            return;

        }


        list.innerHTML =
            data.learning
                .map(
                    (topic, index) => `

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        padding:16px 0;
                        border-bottom:1px solid var(--line);
                    ">

                        <strong>
                            ${escapeHTML(topic)}
                        </strong>

                        <button
                            data-remove-topic="${index}"
                            style="
                                border:0;
                                background:transparent;
                                cursor:pointer;
                                font-size:18px;
                            "
                        >
                            ×
                        </button>

                    </div>

                `
                )
                .join("");


        $$("[data-remove-topic]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.removeTopic
                            );


                        data.learning.splice(
                            index,
                            1
                        );


                        save();

                        renderLearning();

                    }
                );

            });

    }


    /* =====================================================
       INITIAL RENDER
       ===================================================== */

    renderTrace();

    updateScore();


    console.log(
        "%cHAVEN V2 is alive.",
        "font-size:18px;font-weight:bold;"
    );

});

/* =========================================================
   HAVEN V3 — TODAY TASK SYSTEM
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("taskForm");
    const input = document.getElementById("taskInput");
    const list = document.getElementById("taskList");

    const percent = document.getElementById("todayPercent");
    const ring = document.getElementById("todayRing");
    const bar = document.getElementById("todayProgressBar");

    const summary = document.getElementById("taskSummary");
    const clearButton = document.getElementById("clearTasks");

    // Stop safely if the Today section isn't on the page.
    if (!form || !input || !list) {
        return;
    }

    let tasks = [];

    try {
        tasks = JSON.parse(
            localStorage.getItem("havenTasks") || "[]"
        );

        if (!Array.isArray(tasks)) {
            tasks = [];
        }
    } catch (error) {
        console.warn("HAVEN tasks could not be loaded.");
        tasks = [];
    }


    function saveTasks() {

        try {
            localStorage.setItem(
                "havenTasks",
                JSON.stringify(tasks)
            );
        } catch (error) {
            console.warn("HAVEN could not save tasks.");
        }

    }


    function updateProgress() {

        const total = tasks.length;

        const completed = tasks.filter(
            task => task.completed === true
        ).length;

        const progress =
            total === 0
                ? 0
                : Math.round(
                    (completed / total) * 100
                );


        if (percent) {
            percent.textContent = progress;
        }

        if (ring) {
            ring.textContent = `${progress}%`;
        }

        if (bar) {
            bar.style.width = `${progress}%`;
        }


        if (summary) {

            if (total === 0) {

                summary.textContent =
                    "Nothing planned yet.";

            } else {

                summary.textContent =
                    `${completed} of ${total} completed`;

            }

        }

    }


    function renderTasks() {

        list.innerHTML = "";


        if (tasks.length === 0) {

            const empty = document.createElement("div");

            empty.className = "task-empty";

            empty.innerHTML =
                "Your day is still open.<br>" +
                "Add one small thing to begin.";

            list.appendChild(empty);

            updateProgress();

            return;
        }


        tasks.forEach((task, index) => {

            const item =
                document.createElement("div");

            item.className =
                "task-item" +
                (task.completed ? " completed" : "");


            const check =
                document.createElement("button");

            check.type = "button";

            check.className = "task-check";

            check.setAttribute(
                "aria-label",
                "Complete task"
            );


            const text =
                document.createElement("span");

            text.className = "task-text";

            text.textContent = task.text;


            const deleteButton =
                document.createElement("button");

            deleteButton.type = "button";

            deleteButton.className =
                "delete-task";

            deleteButton.setAttribute(
                "aria-label",
                "Delete task"
            );

            deleteButton.textContent = "×";


            check.addEventListener(
                "click",
                () => {

                    tasks[index].completed =
                        !tasks[index].completed;

                    saveTasks();

                    renderTasks();

                }
            );


            deleteButton.addEventListener(
                "click",
                () => {

                    tasks.splice(index, 1);

                    saveTasks();

                    renderTasks();

                }
            );


            item.appendChild(check);

            item.appendChild(text);

            item.appendChild(deleteButton);

            list.appendChild(item);

        });


        updateProgress();

    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const text =
                input.value.trim();


            if (text === "") {
                return;
            }


            tasks.push({

                text: text,

                completed: false,

                createdAt:
                    new Date().toISOString()

            });


            saveTasks();

            input.value = "";

            renderTasks();

            input.focus();

        }
    );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                if (tasks.length === 0) {
                    return;
                }


                tasks = [];

                saveTasks();

                renderTasks();

            }
        );

    }


    renderTasks();

});

/* =========================================================
   HAVEN — MOOD SYSTEM
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const choices =
        document.querySelectorAll(".mood-choice");

    const result =
        document.getElementById("moodResult");

    const advice =
        document.getElementById("moodAdvice");

    const greeting =
        document.getElementById("moodGreeting");


    if (
        !choices.length ||
        !result ||
        !advice
    ) {
        return;
    }


    const responses = {

        calm: {
            title: "You feel calm.",
            advice:
                "Protect that feeling. Choose one meaningful thing and give it your attention.",
            greeting: "A QUIET MOMENT"
        },

        focused: {
            title: "You're focused.",
            advice:
                "This is a good moment to work on the thing you've been putting off.",
            greeting: "YOU'RE IN FLOW"
        },

        happy: {
            title: "You're feeling good.",
            advice:
                "Enjoy it. Notice what created this feeling and carry a little of it forward.",
            greeting: "KEEP THAT LIGHT"
        },

        tired: {
            title: "You're tired.",
            advice:
                "Don't force everything. Drink some water, step away for a few minutes and reset.",
            greeting: "SLOW DOWN"
        },

        stressed: {
            title: "You're carrying a lot.",
            advice:
                "Pause. Take three slow breaths, then choose only the next small thing.",
            greeting: "ONE THING"
        },

        energized: {
            title: "You're energized.",
            advice:
                "Use the momentum. Pick one ambitious thing and start before the feeling fades.",
            greeting: "USE THE ENERGY"
        }

    };


    choices.forEach(choice => {

        choice.addEventListener("click", () => {

            const mood =
                choice.dataset.mood;

            const response =
                responses[mood];


            if (!response) {
                return;
            }


            choices.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            choice.classList.add(
                "active"
            );


            greeting.textContent =
                response.greeting;

            result.textContent =
                response.title;

            advice.textContent =
                response.advice;


            localStorage.setItem(
                "havenMood",
                mood
            );

        });

    });


    /* Restore previous mood */

    const savedMood =
        localStorage.getItem(
            "havenMood"
        );


    if (savedMood) {

        const savedChoice =
            document.querySelector(
                `[data-mood="${savedMood}"]`
            );

        if (savedChoice) {
            savedChoice.click();
        }

    }

});

/* =========================================================
   HAVEN — FOCUS ROOM
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const timeDisplay =
        document.getElementById("focusTime");

    const statusDisplay =
        document.getElementById("focusStatus");

    const taskInput =
        document.getElementById("focusTask");

    const startButton =
        document.getElementById("focusStart");

    const pauseButton =
        document.getElementById("focusPause");

    const resetButton =
        document.getElementById("focusReset");

    const sessionsDisplay =
        document.getElementById("focusSessions");

    const timer =
        document.querySelector(".focus-timer");


    if (
        !timeDisplay ||
        !statusDisplay ||
        !startButton
    ) {
        return;
    }


    let totalSeconds = 25 * 60;

    let remainingSeconds =
        totalSeconds;

    let interval = null;

    let running = false;


    let sessions =
        Number(
            localStorage.getItem(
                "havenFocusSessions"
            ) || 0
        );


    sessionsDisplay.textContent =
        sessions;


    function updateDisplay() {

        const minutes =
            Math.floor(
                remainingSeconds / 60
            );

        const seconds =
            remainingSeconds % 60;


        timeDisplay.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    }


    function startTimer() {

        if (running) {
            return;
        }


        running = true;

        statusDisplay.textContent =
            "FOCUSING";

        timer.classList.add(
            "running"
        );


        interval = setInterval(() => {

            remainingSeconds--;

            updateDisplay();


            if (remainingSeconds <= 0) {

                completeSession();

            }

        }, 1000);

    }


    function pauseTimer() {

        if (!running) {
            return;
        }


        clearInterval(interval);

        interval = null;

        running = false;

        statusDisplay.textContent =
            "PAUSED";

        timer.classList.remove(
            "running"
        );

    }


    function resetTimer() {

        clearInterval(interval);

        interval = null;

        running = false;

        remainingSeconds =
            totalSeconds;

        statusDisplay.textContent =
            "READY";

        timer.classList.remove(
            "running"
        );

        updateDisplay();

    }


    function completeSession() {

        clearInterval(interval);

        interval = null;

        running = false;

        remainingSeconds = 0;

        updateDisplay();

        timer.classList.remove(
            "running"
        );


        sessions++;

        localStorage.setItem(
            "havenFocusSessions",
            sessions
        );


        sessionsDisplay.textContent =
            sessions;


        statusDisplay.textContent =
            "COMPLETE";


        setTimeout(() => {

            alert(
                "Focus session complete. You gave 25 minutes to something that matters."
            );

            resetTimer();

        }, 300);

    }


    startButton.addEventListener(
        "click",
        startTimer
    );


    pauseButton.addEventListener(
        "click",
        pauseTimer
    );


    resetButton.addEventListener(
        "click",
        resetTimer
    );


    updateDisplay();

});

/* =========================================================
   HAVEN — HABIT GARDEN
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("habitForm");

    const input =
        document.getElementById("habitInput");

    const list =
        document.getElementById("habitList");

    const streakDisplay =
        document.getElementById("habitStreak");

    const clearButton =
        document.getElementById("clearHabits");

    const message =
        document.getElementById("gardenMessage");

    const plants =
        document.querySelectorAll(".plant");


    if (!form || !input || !list) {
        return;
    }


    let habits = [];


    try {

        habits =
            JSON.parse(
                localStorage.getItem(
                    "havenHabits"
                ) || "[]"
            );

        if (!Array.isArray(habits)) {
            habits = [];
        }

    } catch (error) {

        habits = [];

    }


    function save() {

        localStorage.setItem(
            "havenHabits",
            JSON.stringify(habits)
        );

    }


    function updateGarden() {

        const completed =
            habits.filter(
                habit => habit.completed
            ).length;


        streakDisplay.textContent =
            completed;


        const messages = [

            "Start something small.",

            "A little growth is happening.",

            "Your garden is waking up.",

            "Look at you showing up.",

            "Your rhythm is becoming visible."

        ];


        const messageIndex =
            Math.min(
                completed,
                messages.length - 1
            );


        message.textContent =
            messages[messageIndex];


        plants.forEach(
            (plant, index) => {

                if (index < completed) {

                    plant.style.transform =
                        `scale(${1 + completed * 0.05})`;

                }

            }
        );

    }


    function render() {

        list.innerHTML = "";


        if (habits.length === 0) {

            const empty =
                document.createElement("div");

            empty.className =
                "habit-empty";

            empty.textContent =
                "Nothing planted yet.";

            list.appendChild(empty);

            updateGarden();

            return;

        }


        habits.forEach(
            (habit, index) => {

                const item =
                    document.createElement("div");

                item.className =
                    "habit-item" +
                    (
                        habit.completed
                            ? " completed"
                            : ""
                    );


                const check =
                    document.createElement("button");

                check.type = "button";

                check.className =
                    "habit-check";


                const name =
                    document.createElement("span");

                name.className =
                    "habit-name";

                name.textContent =
                    habit.name;


                const deleteButton =
                    document.createElement("button");

                deleteButton.type = "button";

                deleteButton.className =
                    "habit-delete";

                deleteButton.textContent =
                    "×";


                check.addEventListener(
                    "click",
                    () => {

                        habits[index].completed =
                            !habits[index].completed;

                        save();

                        render();

                    }
                );


                deleteButton.addEventListener(
                    "click",
                    () => {

                        habits.splice(index, 1);

                        save();

                        render();

                    }
                );


                item.appendChild(check);

                item.appendChild(name);

                item.appendChild(
                    deleteButton
                );

                list.appendChild(item);

            }
        );


        updateGarden();

    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                input.value.trim();


            if (!name) {
                return;
            }


            habits.push({

                name,

                completed: false,

                createdAt:
                    new Date().toISOString()

            });


            save();

            input.value = "";

            render();

            input.focus();

        }
    );


    clearButton?.addEventListener(
        "click",
        () => {

            habits = [];

            save();

            render();

        }
    );


    render();

});

/* =========================================================
   HAVEN — LIVING HABIT GARDEN
   Complete Garden Controller
   ========================================================= */

(function () {

    const habitList =
        document.getElementById("habitList");

    const gardenCount =
        document.getElementById("gardenCount");

    const gardenMood =
        document.getElementById("gardenMood");

    const habitStreak =
        document.getElementById("habitStreak");

    const gardenPercent =
        document.getElementById("gardenPercent");

    const gardenProgress =
        document.getElementById("gardenProgress");

    const gardenWorld =
        document.querySelector(".garden-world");

    const plants =
        document.querySelectorAll(".garden-plant");


    /* Stop safely if Habit Garden isn't on this page */

    if (!habitList) {
        return;
    }


    /* =====================================================
       CALCULATE GARDEN
       ===================================================== */

    function updateGarden() {

        const habits =
            Array.from(
                habitList.querySelectorAll(".habit-item")
            );

        const completed =
            habits.filter(function (habit) {

                return habit.classList.contains("completed");

            }).length;

        const total =
            habits.length;



        /* -----------------------------------------------
           Percentage
           ----------------------------------------------- */

        let percentage = 0;

        if (total > 0) {

            percentage =
                Math.round(
                    (completed / total) * 100
                );

        }


        /* -----------------------------------------------
           Update numbers
           ----------------------------------------------- */

        if (gardenCount) {

            gardenCount.textContent =
                completed;

        }

        if (habitStreak) {

            habitStreak.textContent =
                completed;

        }

        if (gardenPercent) {

            gardenPercent.textContent =
                percentage + "%";

        }


        /* -----------------------------------------------
           Progress circle
           ----------------------------------------------- */

        if (gardenProgress) {

            const circumference =
                213.6;

            const offset =
                circumference -
                (
                    circumference *
                    percentage /
                    100
                );

            gardenProgress.style.strokeDashoffset =
                offset;

        }


        /* -----------------------------------------------
           Garden mood
           ----------------------------------------------- */

        if (gardenMood) {

            if (total === 0) {

                gardenMood.textContent =
                    "A quiet beginning.";

            }

            else if (completed === 0) {

                gardenMood.textContent =
                    "Something is waiting to grow.";

            }

            else if (percentage < 50) {

                gardenMood.textContent =
                    "Your garden is waking up.";

            }

            else if (percentage < 100) {

                gardenMood.textContent =
                    "Your little world is growing.";

            }

            else {

                gardenMood.textContent =
                    "Everything is blooming.";

            }

        }


        /* -----------------------------------------------
           Garden atmosphere
           ----------------------------------------------- */

        if (gardenWorld) {

            gardenWorld.classList.remove(
                "garden-awake",
                "garden-blooming",
                "garden-complete"
            );


            if (percentage > 0) {

                gardenWorld.classList.add(
                    "garden-awake"
                );

            }


            if (percentage >= 50) {

                gardenWorld.classList.add(
                    "garden-blooming"
                );

            }


            if (
                total > 0 &&
                percentage === 100
            ) {

                gardenWorld.classList.add(
                    "garden-complete"
                );

            }

        }


        /* -----------------------------------------------
           Make plants grow
           ----------------------------------------------- */

        plants.forEach(function (plant, index) {

            plant.classList.remove(
                "plant-growing",
                "plant-blooming"
            );


            if (completed > index) {

                plant.classList.add(
                    "plant-growing"
                );

            }


            if (completed > index + 1) {

                plant.classList.add(
                    "plant-blooming"
                );

            }

        });

    }


    /* =====================================================
       PERSONAL HABIT SYMBOLS
       ===================================================== */

    function getHabitType(name) {

        const text =
            name.toLowerCase();


        if (
            text.includes("water") ||
            text.includes("drink") ||
            text.includes("hydr")
        ) {

            return "water";

        }


        if (
            text.includes("read") ||
            text.includes("book") ||
            text.includes("study") ||
            text.includes("learn") ||
            text.includes("python") ||
            text.includes("class")
        ) {

            return "knowledge";

        }


        if (
            text.includes("walk") ||
            text.includes("run") ||
            text.includes("exercise") ||
            text.includes("workout") ||
            text.includes("gym") ||
            text.includes("stretch")
        ) {

            return "movement";

        }


        if (
            text.includes("meditat") ||
            text.includes("breathe") ||
            text.includes("breath") ||
            text.includes("calm") ||
            text.includes("sleep") ||
            text.includes("rest")
        ) {

            return "calm";

        }


        return "flower";

    }


    function decorateHabit(habit) {

        const name =
            habit.querySelector(".habit-name");

        if (!name) {
            return;
        }


        if (
            habit.querySelector(".habit-symbol")
        ) {

            return;

        }


        const type =
            getHabitType(
                name.textContent
            );


        habit.dataset.habitType =
            type;


        const symbol =
            document.createElement("span");

        symbol.className =
            "habit-symbol";


        const symbols = {

            water: "◌",

            knowledge: "✦",

            movement: "⌁",

            calm: "☾",

            flower: "✿"

        };


        symbol.textContent =
            symbols[type];


        habit.insertBefore(
            symbol,
            habit.firstChild
        );

    }


    function decorateAllHabits() {

        const habits =
            habitList.querySelectorAll(
                ".habit-item"
            );


        habits.forEach(function (habit) {

            decorateHabit(habit);

        });

    }


    /* =====================================================
       WATCH HABIT SYSTEM
       ===================================================== */

    const observer =
        new MutationObserver(function () {

            decorateAllHabits();

            updateGarden();

        });


    observer.observe(
        habitList,
        {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class"]
        }
    );


    /* =====================================================
       INITIAL STATE
       ===================================================== */

    decorateAllHabits();

    updateGarden();


    console.log(
        "HAVEN Living Garden is ready."
    );

})();

/* =========================================================
   HABIT COMPLETION FEEDBACK
   ========================================================= */

(function () {

    const habitList =
        document.getElementById("habitList");

    if (!habitList) return;


    function showGardenToast() {

        let toast =
            document.querySelector(".garden-toast");


        if (!toast) {

            toast =
                document.createElement("div");

            toast.className =
                "garden-toast";

            document.body.appendChild(
                toast
            );

        }


        toast.textContent =
            "✦  A little more life in your garden";


        toast.classList.add("show");


        clearTimeout(
            window.havenToastTimer
        );


        window.havenToastTimer =
            setTimeout(function () {

                toast.classList.remove(
                    "show"
                );

            }, 1800);

    }


    const observer =
        new MutationObserver(function (changes) {

            changes.forEach(function (change) {

                if (
                    change.type === "attributes" &&
                    change.attributeName === "class"
                ) {

                    const habit =
                        change.target;


                    if (
                        habit.classList.contains(
                            "habit-item"
                        ) &&
                        habit.classList.contains(
                            "completed"
                        )
                    ) {

                        showGardenToast();

                    }

                }

            });

        });


    observer.observe(
        habitList,
        {
            subtree: true,
            attributes: true,
            attributeFilter: ["class"]
        }
    );

})();

/* =========================================================
   HAVEN — LIVING TRACE
   ========================================================= */

(function () {

    const traceList =
        document.getElementById("traceList");

    const traceEmpty =
        document.getElementById("traceEmpty");

    if (!traceList) return;


    function addTrace(text, icon = "✦") {

        if (traceEmpty) {
            traceEmpty.remove();
        }

        const item =
            document.createElement("div");

        item.className = "trace-item";

        const now =
            new Date();

        const time =
            now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

        item.innerHTML = `
            <span class="trace-dot"></span>

            <span class="trace-icon">
                ${icon}
            </span>

            <div class="trace-text">
                <strong>${text}</strong>
                <small>HAVEN MOMENT</small>
            </div>

            <time class="trace-time">
                ${time}
            </time>
        `;

        traceList.prepend(item);

        saveTrace(text, icon, time);
    }


    function saveTrace(text, icon, time) {

        let history =
            JSON.parse(
                localStorage.getItem("havenTrace") || "[]"
            );

        history.unshift({
            text,
            icon,
            time
        });

        history =
            history.slice(0, 20);

        localStorage.setItem(
            "havenTrace",
            JSON.stringify(history)
        );
    }


    function loadTrace() {

        const history =
            JSON.parse(
                localStorage.getItem("havenTrace") || "[]"
            );

        if (!history.length) return;

        if (traceEmpty) {
            traceEmpty.remove();
        }

        history.reverse().forEach(entry => {

            const item =
                document.createElement("div");

            item.className =
                "trace-item";

            item.innerHTML = `
                <span class="trace-dot"></span>

                <span class="trace-icon">
                    ${entry.icon}
                </span>

                <div class="trace-text">
                    <strong>${entry.text}</strong>
                    <small>HAVEN MOMENT</small>
                </div>

                <time class="trace-time">
                    ${entry.time}
                </time>
            `;

            traceList.appendChild(item);
        });

    }


    /* Make the function available to HAVEN */

    window.havenTrace =
        addTrace;


    loadTrace();


    console.log(
        "HAVEN Living Trace is ready."
    );

})();

/* =========================================================
   GROW WHAT MATTERS — WORKING CONTROLS
   ========================================================= */

(function () {

    const input =
        document.getElementById("habitInput");

    const addButton =
        document.getElementById("addHabitButton");

    const list =
        document.getElementById("habitList");

    const completed =
        document.getElementById("habitCompleted");

    const reflectionInput =
        document.getElementById("reflectionInput");

    const reflectionButton =
        document.getElementById("saveReflection");

    const reflectionResult =
        document.getElementById("reflectionResult");


    if (!input || !addButton || !list) {
        console.log("Habit controls not found.");
        return;
    }


    let habits =
        JSON.parse(
            localStorage.getItem("havenHabitsV2") || "[]"
        );


    function renderHabits() {

        list.innerHTML = "";

        let done = 0;


        habits.forEach(function (habit, index) {

            if (habit.done) {
                done++;
            }


            const item =
                document.createElement("div");

            item.className =
                "habit-item" +
                (habit.done ? " completed" : "");


            item.innerHTML = `

                <button
                    type="button"
                    class="habit-check"
                    aria-label="Complete habit">

                    ${habit.done ? "✓" : ""}

                </button>

                <span class="habit-name">
                    ${escapeHTML(habit.name)}
                </span>

                <button
                    type="button"
                    class="habit-delete"
                    aria-label="Delete habit">

                    ×

                </button>

            `;


            const check =
                item.querySelector(".habit-check");

            const remove =
                item.querySelector(".habit-delete");


            check.addEventListener(
                "click",
                function () {

                    habit.done =
                        !habit.done;

                    save();

                    renderHabits();

                }
            );


            remove.addEventListener(
                "click",
                function () {

                    habits.splice(index, 1);

                    save();

                    renderHabits();

                }
            );


            list.appendChild(item);

        });


        if (completed) {
            completed.textContent = done;
        }


        updateGardenProgress(
            done,
            habits.length
        );

    }


    function addHabit() {

        const name =
            input.value.trim();

        if (!name) {

            input.focus();

            return;
        }


        habits.push({

            name: name,

            done: false

        });


        save();

        renderHabits();


        input.value = "";

        input.focus();

    }


    function save() {

        localStorage.setItem(
            "havenHabitsV2",
            JSON.stringify(habits)
        );

    }


    function updateGardenProgress(
        done,
        total
    ) {

        const percent =
            total === 0
                ? 0
                : Math.round(
                    (done / total) * 100
                );


        const percentElement =
            document.getElementById(
                "gardenPercent"
            );

        const progress =
            document.getElementById(
                "gardenProgress"
            );

        const count =
            document.getElementById(
                "gardenCount"
            );

        const mood =
            document.getElementById(
                "gardenMood"
            );


        if (percentElement) {
            percentElement.textContent =
                percent + "%";
        }


        if (count) {
            count.textContent =
                done;
        }


        if (progress) {

            const circumference =
                2 * Math.PI * 34;

            progress.style.strokeDasharray =
                circumference;

            progress.style.strokeDashoffset =
                circumference -
                (percent / 100) *
                circumference;

        }


        if (mood) {

            if (percent === 0) {
                mood.textContent =
                    "A quiet beginning.";
            }

            else if (percent < 40) {
                mood.textContent =
                    "Something is growing.";
            }

            else if (percent < 80) {
                mood.textContent =
                    "You're making it happen.";
            }

            else if (percent < 100) {
                mood.textContent =
                    "Almost there.";
            }

            else {
                mood.textContent =
                    "Look how much you grew.";
            }

        }

    }


    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value;

        return div.innerHTML;

    }


    addButton.addEventListener(
        "click",
        addHabit
    );


    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {
                addHabit();
            }

        }
    );


    /* REFLECTION */

    if (
        reflectionInput &&
        reflectionButton &&
        reflectionResult
    ) {

        const saved =
            localStorage.getItem(
                "havenReflection"
            );


        if (saved) {

            reflectionResult.textContent =
                "“" + saved + "”";

        }


        reflectionButton.addEventListener(
            "click",
            function () {

                const value =
                    reflectionInput.value.trim();


                if (!value) {

                    reflectionInput.focus();

                    return;

                }


                localStorage.setItem(
                    "havenReflection",
                    value
                );


                reflectionResult.textContent =
                    "“" + value + "”";


                reflectionInput.value = "";

            }
        );

    }


    renderHabits();


    console.log(
        "HAVEN Grow What Matters is working."
    );

})();

/* =========================================================
   YOUR TRACE — INTERACTIVE MEMORY SYSTEM
   ========================================================= */

(function () {

    const input =
        document.getElementById("traceInput");

    const saveButton =
        document.getElementById("saveTrace");

    const memories =
        document.getElementById("traceMemories");

    const empty =
        document.getElementById("traceEmpty");

    const count =
        document.getElementById("traceCount");

    const signal =
        document.getElementById("traceSignal");

    const types =
        document.querySelectorAll(".trace-type");

    const signalDots =
        document.querySelectorAll(".signal-line i");


    if (
        !input ||
        !saveButton ||
        !memories
    ) {
        return;
    }


    let selectedType = "noticed";


    let traces =
        JSON.parse(
            localStorage.getItem(
                "havenTraceV2"
            ) || "[]"
        );


    const symbols = {

        noticed: "○",
        learned: "✦",
        created: "△",
        cared: "♡"

    };


    const labels = {

        noticed: "NOTICED",
        learned: "LEARNED",
        created: "CREATED",
        cared: "CARED"

    };


    types.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                types.forEach(function (item) {

                    item.classList.remove(
                        "active"
                    );

                });

                button.classList.add("active");

                selectedType =
                    button.dataset.type;

            }
        );

    });


    saveButton.addEventListener(
        "click",
        function () {

            const text =
                input.value.trim();

            if (!text) {

                input.focus();

                return;

            }


            traces.unshift({

                id: Date.now(),

                text: text,

                type: selectedType,

                time: new Date()
                    .toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )

            });


            traces =
                traces.slice(0, 12);


            localStorage.setItem(
                "havenTraceV2",
                JSON.stringify(traces)
            );


            input.value = "";

            render();

        }
    );


    function render() {

        memories.innerHTML = "";


        if (count) {

            count.textContent =
                traces.length;

        }


        if (empty) {

            empty.style.display =
                traces.length
                    ? "none"
                    : "block";

        }


        traces.forEach(function (trace) {

            const card =
                document.createElement("article");

            card.className =
                "trace-memory-card";


            card.innerHTML = `

                <div class="memory-card-top">

                    <span class="memory-card-symbol">
                        ${symbols[trace.type]}
                    </span>

                    <button
                        class="memory-delete"
                        type="button"
                        aria-label="Delete trace">

                        ×

                    </button>

                </div>

                <p>
                    ${escapeHTML(trace.text)}
                </p>

                <small>
                    ${labels[trace.type]}
                    ·
                    ${trace.time}
                </small>

            `;


            card.querySelector(
                ".memory-delete"
            ).addEventListener(
                "click",
                function () {

                    traces =
                        traces.filter(
                            item =>
                                item.id !==
                                trace.id
                        );

                    localStorage.setItem(
                        "havenTraceV2",
                        JSON.stringify(
                            traces
                        )
                    );

                    render();

                }
            );


            memories.appendChild(card);

        });


        updateSignal();

    }


    function updateSignal() {

        const total =
            traces.length;


        let message =
            "A quiet beginning.";


        if (total === 1) {

            message =
                "One small thing noticed.";

        } else if (total === 2) {

            message =
                "Your day is beginning to take shape.";

        } else if (total === 3) {

            message =
                "Look closely. You are already growing.";

        } else if (total >= 4 && total < 7) {

            message =
                "There is more to your day than you think.";

        } else if (total >= 7) {

            message =
                "A whole little world happened today.";

        }


        if (signal) {

            signal.textContent =
                message;

        }


        signalDots.forEach(
            function (dot, index) {

                dot.classList.toggle(
                    "active",
                    index < Math.min(
                        total,
                        7
                    )
                );

            }
        );

    }


    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value;

        return div.innerHTML;

    }


    render();


    console.log(
        "HAVEN Trace is alive."
    );

})();