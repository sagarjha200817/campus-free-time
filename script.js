let timetableData = {};

// Load JSON data when the page loads
async function loadData() {
    try {
        const response = await fetch('timetables.json');
        timetableData = await response.json();
        populateDropdowns();
    } catch (error) {
        console.error("Error loading timetables:", error);
    }
}

function populateDropdowns() {
    const userSelect = document.getElementById('currentUser');
    userSelect.innerHTML = '<option value="">-- Select Your Name --</option>';
    
    timetableData.people.forEach((person, index) => {
        let option = document.createElement('option');
        option.value = index;
        option.textContent = `${person.name} (${person.section})`;
        userSelect.appendChild(option);
    });
}

function checkAvailability() {
    const selectedUserIndex = document.getElementById('currentUser').value;
    const selectedDay = document.getElementById('selectDay').value;
    const selectedTime = document.getElementById('selectTime').value; // e.g., "2:00"

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (selectedUserIndex === "") {
        alert("Please select your name first!");
        return;
    }

    const currentUser = timetableData.people[selectedUserIndex];
    let freePeople = [];
    let busyPeople = [];

    timetableData.people.forEach(person => {
        // Skip current user if desired, or keep them
        const daySchedule = person.schedule[selectedDay];
        let status = "Free";

        if (daySchedule && daySchedule[selectedTime]) {
            status = daySchedule[selectedTime];
        }

        if (status.toLowerCase().includes("free")) {
            freePeople.push(person.name);
        } else {
            busyPeople.push({ name: person.name, task: status });
        }
    });

    // Render HTML Output
    let html = `
        <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 class="text-xl font-bold text-gray-800 mb-2">Results for ${selectedDay} at ${selectedTime} PM</h3>
            <p class="text-sm text-gray-500 mb-4">You (${currentUser.name}) are currently: <span class="font-semibold text-blue-600">${currentUser.schedule[selectedDay]?.[selectedTime] || 'Free'}</span></p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 class="font-bold text-green-700 mb-2">🟢 Free Right Now (${freePeople.length})</h4>
                    <ul class="list-disc list-inside text-gray-700">
                        ${freePeople.map(name => `<li>${name} ${name === currentUser.name ? '(You)' : ''}</li>`).join('')}
                    </ul>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 class="font-bold text-red-700 mb-2">🔴 Busy / In Class (${busyPeople.length})</h4>
                    <ul class="list-disc list-inside text-gray-700">
                        ${busyPeople.map(p => `<li><strong>${p.name}</strong>: ${p.task}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
    resultsDiv.innerHTML = html;
}

window.onload = loadData;