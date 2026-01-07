const input = document.getElementById("wordInput");
const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");
const errorDiv = document.getElementById("error");

// Search on button click
searchBtn.addEventListener("click", searchWord);

// Search on Enter key
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchWord();
    }
});

function searchWord() {
    const word = input.value.trim();
    resultDiv.innerHTML = "";
    errorDiv.textContent = "";

    if (word === "") {
        alert("Please enter a word");
        return;
    }

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then(data => {
            const entry = data[0];
            const meaning = entry.meanings[0];
            const definition = meaning.definitions[0];

            // Phonetics and audio
            let phonetic = "Not available";
            let audioUrl = "";

            if (entry.phonetics && entry.phonetics.length > 0) {
                const phoneticObj = entry.phonetics.find(p => p.text || p.audio);
                if (phoneticObj?.text) phonetic = phoneticObj.text;
                if (phoneticObj?.audio) audioUrl = phoneticObj.audio;
            }

            resultDiv.innerHTML = `
                <p><span class="label">Word:</span> ${entry.word}</p>
                <p><span class="label">Part of Speech:</span> ${meaning.partOfSpeech}</p>
                <p><span class="label">Meaning:</span> ${definition.definition}</p>
                <p><span class="label">Example:</span> ${definition.example || "Example not available"}</p>
                <p><span class="label">Phonetic:</span> ${phonetic}</p>
            `;

            if (audioUrl) {
                const audio = document.createElement("audio");
                audio.controls = true;
                audio.src = audioUrl;
                resultDiv.appendChild(audio);
            }
        })
        .catch(() => {
            errorDiv.textContent = "Word not found. Please try another word.";
        });
}
