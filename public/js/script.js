// =========================================
// GET HTML ELEMENTS
// =========================================

const contentInput =
    document.getElementById("content");

const scanButton =
    document.getElementById("scanButton");

const clearButton =
    document.getElementById("clearButton");

const newScanButton =
    document.getElementById("newScanButton");

const loading =
    document.getElementById("loading");

const result =
    document.getElementById("result");

const scoreElement =
    document.getElementById("score");

const levelElement =
    document.getElementById("level");

const reasonsList =
    document.getElementById("reasonsList");

const recommendationElement =
    document.getElementById("recommendation");

const characterCount =
    document.getElementById("characterCount");

const scoreCircle =
    document.querySelector(".score-circle");



// =========================================
// CHARACTER COUNTER
// =========================================

contentInput.addEventListener(
    "input",
    function () {

        const length =
            contentInput.value.length;

        characterCount.textContent =
            `${length} characters`;

    }
);



// =========================================
// CLEAR BUTTON
// =========================================

clearButton.addEventListener(
    "click",
    function () {

        contentInput.value = "";

        characterCount.textContent =
            "0 characters";

        contentInput.focus();

    }
);



// =========================================
// SCAN BUTTON
// =========================================

scanButton.addEventListener(
    "click",
    async function () {

        const content =
            contentInput.value.trim();


        // Check empty input

        if (!content) {

            alert(
                "Please enter a URL, SMS, email or message to analyze."
            );

            contentInput.focus();

            return;
        }


        // =====================================
        // SHOW LOADING
        // =====================================

        scanButton.disabled = true;

        result.classList.add("hidden");

        loading.classList.remove("hidden");


        // Scroll to loading area

        loading.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        try {

            // Small delay to make scanning animation visible

            await new Promise(
                resolve => setTimeout(resolve, 900)
            );


            // =================================
            // SEND REQUEST TO BACKEND
            // =================================

            const response =
                await fetch("/api/scan", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        content: content
                    })

                });


            const data =
                await response.json();


            // =================================
            // HANDLE BACKEND ERROR
            // =================================

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Something went wrong."
                );

            }


            // =================================
            // DISPLAY RESULT
            // =================================

            displayResult(data);


        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to the security server. Make sure your Node.js server is running."
            );

        } finally {

            loading.classList.add("hidden");

            scanButton.disabled = false;

        }

    }
);



// =========================================
// DISPLAY RESULT
// =========================================

function displayResult(data) {

    const score =
        Number(data.score) || 0;

    const level =
        data.level || "LOW";


    // =====================================
    // SCORE
    // =====================================

    scoreElement.textContent =
        "0";


    animateScore(
        score
    );


    // =====================================
    // SCORE CIRCLE
    // =====================================

    const angle =
        (score / 100) * 360;

    scoreCircle.style
        .setProperty(
            "--score-angle",
            `${angle}deg`
        );


    // =====================================
    // RISK LEVEL
    // =====================================

    levelElement.textContent =
        level;


    levelElement.classList.remove(
        "high",
        "medium",
        "low"
    );


    if (level === "HIGH") {

        levelElement.classList.add(
            "high"
        );

    } else if (level === "MEDIUM") {

        levelElement.classList.add(
            "medium"
        );

    } else {

        levelElement.classList.add(
            "low"
        );

    }


    // =====================================
    // REASONS
    // =====================================

    reasonsList.innerHTML = "";


    if (
        data.reasons &&
        data.reasons.length > 0
    ) {

        data.reasons.forEach(
            function (reason) {

                const li =
                    document.createElement("li");

                li.textContent =
                    reason;

                reasonsList.appendChild(li);

            }
        );

    } else {

        const li =
            document.createElement("li");

        li.textContent =
            "No major suspicious indicators detected.";

        reasonsList.appendChild(li);

    }


    // =====================================
    // RECOMMENDATION
    // =====================================

    recommendationElement.textContent =
        data.recommendation ||
        "Verify the source before taking any action.";


    // =====================================
    // SHOW RESULT
    // =====================================

    result.classList.remove(
        "hidden"
    );


    setTimeout(
        function () {

            result.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        },
        100
    );

}



// =========================================
// ANIMATE SCORE
// =========================================

function animateScore(targetScore) {

    let currentScore = 0;

    const duration = 900;

    const startTime =
        performance.now();


    function updateScore(
        currentTime
    ) {

        const elapsed =
            currentTime - startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        // Smooth animation

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        currentScore =
            Math.round(
                targetScore * eased
            );


        scoreElement.textContent =
            currentScore;


        if (progress < 1) {

            requestAnimationFrame(
                updateScore
            );

        }

    }


    requestAnimationFrame(
        updateScore
    );

}



// =========================================
// NEW SCAN BUTTON
// =========================================

newScanButton.addEventListener(
    "click",
    function () {

        result.classList.add(
            "hidden"
        );


        contentInput.value = "";

        characterCount.textContent =
            "0 characters";


        document
            .getElementById("scanner")
            .scrollIntoView({
                behavior: "smooth"
            });


        setTimeout(
            function () {
                contentInput.focus();
            },
            500
        );

    }
);



// =========================================
// ENTER KEY SHORTCUT
// =========================================

contentInput.addEventListener(
    "keydown",
    function (event) {

        // Ctrl + Enter = Scan

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            scanButton.click();

        }

    }
);