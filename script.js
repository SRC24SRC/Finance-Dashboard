// Define the categories for the cards. Each category has an ID, name, and description.
const categories = [
    { id: 'income-card', name: 'Income', description: 'List all of your sources of income' },
    { id: 'expenses-card', name: 'Expenses', description: 'List all your expenses' },
    { id: 'debts-card', name: 'Debts', description: 'List all your debts' },
    { id: 'savings-card', name: 'Savings', description: 'List all your savings' }
];

// Function to create cards dynamically based on the template
function createCards() {
    const dashboard = document.getElementById('dashboard'); // Container for all cards
    const template = document.getElementById('card-template'); // Reference to the template

    categories.forEach(category => {
        const cardClone = template.content.cloneNode(true); // Create a copy of the template
        const card = cardClone.querySelector('.card');

        // Populate elements in the template with specific category data
        // category.id is the id of the array
        card.id = category.id;
        //we select the h3 of the template; .textContent is what is inside h3. category.name refers to the name property in the category array
        card.querySelector('h3').textContent = category.name; // Set the title (e.g., "Income")
        //the same filling the template .description element with the description of the array
        card.querySelector('.description').textContent = category.description; // Set the description
        card.querySelector('.add-button').onclick = () => addRow(category.id); // Link the add button to the addRow function
        card.querySelector('.total').id = `${category.id}-total`; // Set ID for total calculation
//.appendChild adds the element at the end of the dashboard
        dashboard.appendChild(card); // Add the completed card to the dashboard
    });
}

// Called when the page is loaded to create the cards
document.addEventListener('DOMContentLoaded', createCards);

// Function to create a new row in a specific card
function addRow(cardId) {
    if (cardId === 'income-card' || cardId === 'savings-card') {
        playSound('cashSound'); // Play sound only for specific cards
    }

    const card = document.getElementById(cardId);
    const row = createRow(); // Generate a new row
    //Insert Before +row,... checken ob es am Ende oder am Anfang eingefügt wird
    card.insertBefore(row, card.lastElementChild); // Insert the new row into the card
}

// Helper function to create a new row with input fields and a delete button
function createRow() {
    const row = document.createElement('div');
    row.className = 'row';

    // Use generic functions to create input fields and buttons
    const inputSource = createInput('text', 'source');
    const inputAmount = createInput('number', 'amount', { step: '0.01', min: '0' });
    const deleteButton = createButton('Delete', 'delete-button', () => row.remove());

    row.appendChild(inputSource);
    row.appendChild(inputAmount);
    row.appendChild(deleteButton);

    return row;
}

// Generic function to create an input field
function createInput(type, placeholder, attributes = {}) {
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    Object.assign(input, attributes); // Add additional attributes (like step or min)
    return input;
}

// Generic function to create a button
function createButton(text, className, onClickHandler) {
    const button = document.createElement('button');
    button.className = className;
    button.textContent = text;
    button.onclick = onClickHandler;
    return button;
}

// Generic function to play the corresponding sound
function playSound(soundId) {
    const audio = document.getElementById(soundId);
    audio.currentTime = 0;
    audio.play();
}

// Function to calculate the total result
function calculate() {
    const totals = categories.reduce((acc, category) => {
        acc[category.name.toLowerCase()] = calculateTotal(category.id); // Calculate total for each category
        return acc;
    }, {});

    const finalResult = totals.income + totals.savings - totals.expenses - totals.debts; // Calculate final result
    document.getElementById('final-result').textContent = `Total: ${finalResult.toFixed(2)} €`; // Display the final result

    // Play the appropriate sound based on the result
    playSound(finalResult >= 0 ? 'goodResult' : 'failSound');
}

// Function to calculate the total within a card (e.g., sum all income entries)
function calculateTotal(cardId) {
    const card = document.getElementById(cardId);
    const inputs = card.querySelectorAll('input[type="number"]'); // Get all number input fields
    return Array.from(inputs).reduce((total, input) => {
        const value = parseFloat(input.value) || 0; // Parse the value or default to 0
        return total + Math.round(value * 100) / 100; // Round to two decimal places
    }, 0);
}
