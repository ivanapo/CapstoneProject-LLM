document.getElementById("send-btn").addEventListener("click", async function() {
    await handleMessage();
});

document.getElementById("user-input").addEventListener("keypress", async function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); 
        await handleMessage();
    }
});

async function handleMessage() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput.trim()) return;

    displayMessage(userInput, 'user-message');

    document.getElementById("user-input").value = '';

    const loadingMessage = displayMessage("Loading...", 'bot-message', true);


    try {
        const response = await submitQuery(userInput);

        removeMessage(loadingMessage);

        displayMessage(response.answer_text, 'bot-message');

        if (response.sources && response.sources.length > 0) {
            displaySources(response.sources);
        }
    } catch (error) {
        removeMessage(loadingMessage);
        displayMessage("Something went wrong. Please try again.", 'bot-message');
    }
}

function displayMessage(text, className, isLoading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.textContent = text;

    if (isLoading) {
        messageDiv.classList.add('loading');
    }

    document.getElementById("chat-window").appendChild(messageDiv);
    messageDiv.scrollIntoView({ behavior: "smooth" });

    return messageDiv;
}

function displaySources(sources) {
    const sourcesDiv = document.createElement('div');
    sourcesDiv.classList.add('sources', 'bot-source'); 
    
    const sourceTitle = document.createElement('p');
    sourceTitle.textContent = 'Sources:';
    sourcesDiv.appendChild(sourceTitle);

    const sourcesList = document.createElement('ul');
    sources.forEach(source => {
        const listItem = document.createElement('li');
        listItem.textContent = source;
        sourcesList.appendChild(listItem);
    });
    sourcesDiv.appendChild(sourcesList);

    document.getElementById("chat-window").appendChild(sourcesDiv);
    sourcesDiv.scrollIntoView({ behavior: "smooth" });
}

function removeMessage(messageDiv) {
    if (messageDiv) {
        messageDiv.remove();
    }
}

async function submitQuery(queryText) {
    const response = await fetch("http://127.0.0.1:8000/submit_query", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query_text: queryText })
    });

    const data = await response.json();
    return data;
}
