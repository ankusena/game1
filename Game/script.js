document.addEventListener('DOMContentLoaded', () => {
    const languageSelection = document.getElementById('language');
    const levelSelection = document.getElementById('level');
    const showIntroButton = document.getElementById('show-intro');
    const wordTableDiv = document.getElementById('word-table');
    const startGameButton = document.getElementById('start-game');
    const gameSection = document.getElementById('game');
    const controlsSection = document.getElementById('controls');
    const wordsList = document.getElementById('words-list');
    const translationsList = document.getElementById('translations-list');
    const result = document.getElementById('result');
    const explanationsDiv = document.getElementById('explanations');
    const checkMatchesButton = document.getElementById('check-matches');
    const hintButton = document.getElementById('hint-btn');
    const clueButton = document.getElementById('clue-btn');

    let currentLanguage = 'spanish';
    let currentLevel = 1;
    let draggedItem = null;

    // Example words data for 5 levels in 10 languages
    const wordsData = {
        spanish: {
            1: { cat: 'gato', dog: 'perro', house: 'casa' },
            2: { apple: 'manzana', book: 'libro', car: 'coche' },
            3: { red: 'rojo', blue: 'azul', green: 'verde' },
            4: { school: 'escuela', teacher: 'maestro', student: 'estudiante' },
            5: { hello: 'hola', goodbye: 'adios', please: 'por favor' }
        },
        // Add more languages here...
        // The format is similar to Spanish
    };

    // Language explanations for the words
    const explanations = {
        spanish: {
            cat: "Gato means 'Cat' in Spanish. It's a common pet.",
            dog: "Perro means 'Dog' in Spanish. It's often called man's best friend.",
            house: "Casa means 'House' in Spanish. It's a place where people live.",
            // Add more explanations corresponding to levels and languages...
        },
        // More languages' explanations...
    };

    // Event listener for language selection
    languageSelection.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
    });

    // Event listener for level selection
    levelSelection.addEventListener('change', (e) => {
        currentLevel = parseInt(e.target.value, 10);
    });

    // Event listener to show the introduction
    showIntroButton.addEventListener('click', () => {
        const words = wordsData[currentLanguage][currentLevel];
        wordTableDiv.innerHTML = `<table>
            <thead>
                <tr><th>Word</th><th>Translation</th></tr>
            </thead>
            <tbody>
                ${Object.entries(words).map(([word, translation]) => 
                    `<tr><td>${word}</td><td>${translation}</td></tr>`).join('')}
            </tbody>
        </table>`;
        wordTableDiv.style.display = 'block';
        startGameButton.style.display = 'inline-block';
    });

    // Event listener to start the game
    startGameButton.addEventListener('click', () => {
        const words = wordsData[currentLanguage][currentLevel];
        wordsList.innerHTML = Object.keys(words).map(word => 
            `<li draggable="true" data-match="${words[word]}">${word}</li>`).join('');
        translationsList.innerHTML = Object.values(words).map(translation => 
            `<li id="${translation}">${translation}</li>`).join('');

        gameSection.style.display = 'flex';
        controlsSection.style.display = 'flex';

        // Add drag events to words
        addDragEventsToWords();
    });

    // Function to add drag events to words
    function addDragEventsToWords() {
        const words = document.querySelectorAll('#words-list li');
        const translations = document.querySelectorAll('#translations-list li');

        words.forEach(word => {
            word.addEventListener('dragstart', () => {
                draggedItem = word;
                setTimeout(() => {
                    word.style.display = 'none';
                }, 0);
            });

            word.addEventListener('dragend', () => {
                setTimeout(() => {
                    word.style.display = 'block';
                    draggedItem = null;
                }, 0);
            });
        });

        translations.forEach(translation => {
            translation.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            translation.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedItem && draggedItem.dataset.match === translation.id) {
                    translation.style.backgroundColor = '#4CAF50';
                    draggedItem.style.backgroundColor = '#4CAF50';
                    translation.appendChild(draggedItem);
                }
            });
        });
    }

    // Event listener to check matches
    checkMatchesButton.addEventListener('click', () => {
        const translations = document.querySelectorAll('#translations-list li');
        let correctMatches = 0;

        translations.forEach(translation => {
            if (translation.children.length > 0 && translation.children[0].dataset.match === translation.id) {
                correctMatches++;
            }
        });

        if (correctMatches === translations.length) {
            result.textContent = 'All matches are correct! Well done!';
            result.style.color = 'green';
        } else {
            result.textContent = `You have ${correctMatches} correct matches. Well Done!`;
            result.style.color = 'green';
        }

        // Display explanations
        const words = wordsData[currentLanguage][currentLevel];
        explanationsDiv.innerHTML = "<h3>Word Explanations:</h3>";
        Object.keys(words).forEach(key => {
            explanationsDiv.innerHTML += `<p>${explanations[currentLanguage][key]}</p>`;
        });
    });

    // Show hint for the dragged word
    hintButton.addEventListener('click', () => {
        if (draggedItem) {
            const wordHint = explanations[currentLanguage][draggedItem.textContent.toLowerCase()];
            alert(`Hint: ${wordHint}`);
        } else {
            alert('Drag a word to get a hint!');
        }
    });

    // Provide a clue
    clueButton.addEventListener('click', () => {
        const words = wordsData[currentLanguage][currentLevel];
        const randomWord = Object.keys(words)[Math.floor(Math.random() * Object.keys(words).length)];
        alert(`Clue: "${randomWord}" is matched with "${words[randomWord]}".`);
    });
});
