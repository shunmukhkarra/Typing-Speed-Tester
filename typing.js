document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('i');

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            themeIcon?.classList.remove('fa-moon');
            themeIcon?.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon?.classList.remove('fa-sun');
            themeIcon?.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });


    const hiddenInput = document.getElementById('hidden-input');

    document.addEventListener('click', () => {
        hiddenInput.focus();  // Focus on hidden input when anywhere is clicked
    });


    // Screen elements
    // const homeScreen = document.getElementById('home-screen');
    const testScreen = document.getElementById('test-screen');

    const navTestBtn = document.getElementById('nav-test');
    const navTestBtn2 = document.getElementById('nav-test2');

    // Test elements
    const textDisplay = document.getElementById('text-display');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const results = document.getElementById('results');
    const retryBtn = document.getElementById('retry-btn');
    const imageTypingContainer = document.getElementById('image-typing-container');

    // Stats elements
    const wpmElement = document.getElementById('wpm');
    const accuracyElement = document.getElementById('accuracy');
    const timerElement = document.getElementById('timer');
    const errorsElement = document.getElementById('errors');
    const finalWpmElement = document.getElementById('final-wpm');
    const finalAccuracyElement = document.getElementById('final-accuracy');
    const finalErrorsElement = document.getElementById('final-errors');

    // Text samples
    const textSamples = {
        easy: [
            "The quick brown fox jumps over the lazy dog. This is a simple sentence for typing practice. Keep practicing to improve your speed. Regular practice helps develop muscle memory and improves accuracy over time. Start with easy texts to build your confidence and gradually move to more complex ones as you improve.",
            "Typing is a fundamental skill in today's digital world. Whether you're a student, professional, or casual computer user, improving your typing speed and accuracy can save you valuable time. Practice consistently and watch your skills grow. Remember, accuracy is just as important as speed when it comes to efficient typing.",
            "Learning to type quickly and accurately is a journey that requires patience and dedication. Begin with proper finger placement on the keyboard. Your index fingers should rest on the F and J keys, which typically have small bumps to help you find them without looking. This is the home row position.",
            "Consistent practice is key to becoming a proficient typist. Set aside a few minutes each day to practice typing. Start with simple exercises and gradually increase the difficulty. Over time, you'll notice improvements in both your speed and accuracy. Don't get discouraged by mistakes; they are part of the learning process."
        ],
        medium: [
            "Touch typing is a method of typing without looking at the keyboard. This technique allows for faster typing speeds and reduces errors. The fundamental concept is that each finger is responsible for specific keys. With practice, your fingers will automatically move to the correct keys.",
            "Programming languages are formal languages comprising a set of instructions that produce various kinds of output. They are used in computer programming to implement algorithms. Popular programming languages include Python, JavaScript, Java, C++, and Ruby. Each has its own syntax and semantics.",
            "Web development involves creating websites and web applications. Front-end developers focus on the user interface and user experience, using HTML, CSS, and JavaScript. Back-end developers work on server-side logic and databases. Full-stack developers are proficient in both front-end and back-end technologies.",
            "Responsive web design is an approach that makes web pages render well on a variety of devices and window sizes. It involves using flexible layouts, flexible images, and CSS media queries. As the user switches between devices, the website should automatically adjust to accommodate resolution and screen size."
        ],
        hard: [
            "Quantum computing represents a revolutionary approach to computation that leverages quantum-mechanical phenomena such as superposition and entanglement. Unlike classical computers that use bits (0s and 1s), quantum computers use quantum bits or qubits, which can exist in multiple states simultaneously.",
            "Machine learning algorithms build mathematical models based on sample data, known as training data, to make predictions or decisions without being explicitly programmed to perform the task. These algorithms are classified as supervised learning, unsupervised learning, and reinforcement learning.",
            "Blockchain technology creates a decentralized, distributed ledger that records transactions across many computers in such a way that the registered transactions cannot be altered retroactively. This technology underpins cryptocurrencies like Bitcoin and Ethereum but has applications beyond digital currencies.",
            "Artificial neural networks are computing systems inspired by the biological neural networks in animal brains. Such systems learn to perform tasks by considering examples, generally without being programmed with task-specific rules. They have been used in various fields including computer vision and natural language processing."
        ],
        programming: [
            "function calculateFactorial(n) { if (n === 0 || n === 1) return 1; let result = 1; for (let i = 2; i <= n; i++) { result *= i; } return result; } console.log(calculateFactorial(5)); // Output: 120",
            "const fetchData = async () => { try { const response = await fetch('https://api.example.com/data'); const data = await response.json(); console.log(data); } catch (error) { console.error('Error fetching data:', error); } }; fetchData();",
            "class Rectangle { constructor(width, height) { this.width = width; this.height = height; } get area() { return this.calcArea(); } calcArea() { return this.width * this.height; } } const square = new Rectangle(10, 10); console.log(square.area); // Output: 100",
            "const debounce = (func, delay) => { let timeoutId; return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => { func.apply(this, args); }, delay); }; }; window.addEventListener('resize', debounce(handleResize, 300));"
        ]
    };

    let testStarted = false;
    let testCompleted = false;
    let timer;
    let secondsRemaining = 60;
    let wordsTyped = 0;
    let errors = 0;
    let totalCharacters = 0;
    let correctCharacters = 0;
    let originalText = "";
    let userInput = "";
    let currentDuration = 60;
    let currentDifficulty = "easy";
    let testType = "text";

    function initTest() {
        const sampleTexts = textSamples[currentDifficulty];
        originalText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        renderText();
        secondsRemaining = currentDuration;
        wordsTyped = 0;
        errors = 0;
        totalCharacters = 0;
        correctCharacters = 0;
        userInput = "";
        wpmElement.textContent = '0';
        accuracyElement.textContent = '100%';
        timerElement.textContent = secondsRemaining;
        errorsElement.textContent = '0';
        hiddenInput.value = '';
        hiddenInput.disabled = false;
        results.classList.remove('active');
        if (testType === "image") {
            imageTypingContainer.style.display = "block";
            textDisplay.style.display = "none";
        } else {
            imageTypingContainer.style.display = "none";
            textDisplay.style.display = "block";
        }
    }

    function renderText() {
    const display = document.getElementById('text-display');
    display.innerHTML = '';

    for (let i = 0; i < originalText.length; i++) {
        const span = document.createElement('span');
        span.innerText = originalText[i];

        if (i < userInput.length) {
            span.className = userInput[i] === originalText[i] ? 'correct' : 'incorrect';
        } else if (i === userInput.length && testStarted) {
            span.classList.add('active');
        }

        display.appendChild(span);
    }
}



    function startTest() {
        if (testStarted) return;
        testStarted = true;
        testCompleted = false;
        startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Test';
        hiddenInput.focus();
        timer = setInterval(() => {
            secondsRemaining--;
            timerElement.textContent = secondsRemaining;
            if (secondsRemaining <= 0) endTest();
        }, 1000);
    }

    function pauseTest() {
        clearInterval(timer);
        testStarted = false;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Resume Test';
    }

    function endTest() {
        clearInterval(timer);
        testStarted = false;
        testCompleted = true;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start Test';
        hiddenInput.disabled = true;
        const wpm = Math.round((userInput.split(/\s+/).length - 1) * (60 / (currentDuration - secondsRemaining)));
        const accuracy = totalCharacters > 0 ? Math.round((correctCharacters / totalCharacters) * 100) : 100;
        finalWpmElement.textContent = wpm;
        finalAccuracyElement.textContent = `${accuracy}%`;
        finalErrorsElement.textContent = errors;
        results.classList.add('active');
        results.scrollIntoView({ behavior: 'smooth' });
    }

    function resetTest() {
        clearInterval(timer);
        testStarted = false;
        testCompleted = false;
        secondsRemaining = currentDuration;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start Test';
        initTest();
    }

    hiddenInput.addEventListener('input', () => {
    if (!testStarted && !testCompleted) startTest();

    userInput = hiddenInput.value;
    totalCharacters = userInput.length;
    correctCharacters = 0;
    errors = 0;

    for (let i = 0; i < userInput.length; i++) {
        if (i < originalText.length && userInput[i] === originalText[i]) {
            correctCharacters++;
        } else {
            errors++;
        }
    }

    wordsTyped = userInput.trim().split(/\s+/).length;
    const elapsedTime = currentDuration - secondsRemaining;
    const wpm = elapsedTime > 0 ? Math.round(wordsTyped * (60 / elapsedTime)) : 0;
    wpmElement.textContent = wpm;
    const accuracy = totalCharacters > 0 ? Math.round((correctCharacters / totalCharacters) * 100) : 100;
    accuracyElement.textContent = `${accuracy}%`;
    errorsElement.textContent = errors;

    renderText();

    // Auto-load new paragraph if completed early
    if (userInput === originalText && secondsRemaining > 0) {
        userInput = "";
        hiddenInput.value = "";
        totalCharacters = 0;
        correctCharacters = 0;
        errors = 0;
        wordsTyped++;

        const newSample = textSamples[currentDifficulty][Math.floor(Math.random() * textSamples[currentDifficulty].length)];
        originalText = newSample;
        renderText();
    }
});


    startBtn.addEventListener('click', () => {
        if (testCompleted) {
            resetTest();
            return;
        }
        testStarted ? pauseTest() : startTest();
    });

    resetBtn.addEventListener('click', resetTest);
    retryBtn.addEventListener('click', resetTest);

    navTestBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // homeScreen.style.display = 'none';
    testScreen.style.display = 'block';
    initTest();
    testScreen.scrollIntoView({ behavior: 'smooth' });
    });

    navTestBtn2.addEventListener('click', () => {
    // homeScreen.style.display = 'none';
    testScreen.style.display = 'block';
    initTest();
    testScreen.scrollIntoView({ behavior: 'smooth' });
    });

    document.querySelectorAll('[data-duration]').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('[data-duration]').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentDuration = parseInt(button.dataset.duration);
            secondsRemaining = currentDuration;
            timerElement.textContent = currentDuration;
            resetTest();
        });
    });

    document.querySelectorAll('[data-difficulty]').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('[data-difficulty]').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentDifficulty = button.dataset.difficulty;
            resetTest();
        });
    });

    document.querySelectorAll('[data-type]').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('[data-type]').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            testType = button.dataset.type;
            resetTest();
        });
    });

    initTest();
});