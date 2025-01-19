document.addEventListener("DOMContentLoaded", () => {
    loadEvents();
});

// Load events from the backend
async function loadEvents() {
    try {
        const response = await fetch("/api/events");
        const events = await response.json();
        displayEvents(events);
    } catch (error) {
        console.error("Error fetching events:", error);
    }
}

// Display events on index.html
function displayEvents(events) {
    const eventsContainer = document.getElementById("events-container");
    if (!eventsContainer) return;

    eventsContainer.innerHTML = "";
    events.forEach(event => {
        const eventCard = document.createElement("div");
        eventCard.classList.add("event-card");
        eventCard.innerHTML = `
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p><strong>Date:</strong> ${event.date}</p>
            <div class="card-actions">
                <a href="view-event.html?id=${event.id}" class="view-button">View</a>
                <a href="edit-event.html?id=${event.id}" class="edit-button">Edit</a>
                <button class="delete-button" onclick="deleteEvent(${event.id})">Delete</button>
            </div>
        `;
        eventsContainer.appendChild(eventCard);
    });
}

// Handle event creation
const eventForm = document.getElementById("event-form");
if (eventForm) {
    eventForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();
        const date = document.getElementById("date").value;

        if (!title || !description || !date) {
            alert("All fields are required!");
            return;
        }

        try {
            const response = await fetch("/add-event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, date })
            });

            if (response.ok) {
                alert("Event added successfully!");
                window.location.href = "index.html";
            } else {
                alert("Error adding event");
            }
        } catch (error) {
            console.error("Error adding event:", error);
        }
    });
}

// Load a specific event for viewing
async function loadEventDetails() {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id");

    if (!eventId) return;

    try {
        const response = await fetch(`/api/events/${eventId}`);
        const event = await response.json();

        document.getElementById("event-title").innerText = event.title;
        document.getElementById("event-description").innerText = event.description;
        document.getElementById("event-date").innerText = `Date: ${event.date}`;
    } catch (error) {
        console.error("Error loading event details:", error);
    }
}

// Load event details for editing
async function loadEditEventForm() {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id");

    if (!eventId) return;

    try {
        const response = await fetch(`/api/events/${eventId}`);
        const event = await response.json();

        document.getElementById("title").value = event.title;
        document.getElementById("description").value = event.description;
        document.getElementById("date").value = event.date;
    } catch (error) {
        console.error("Error loading event for edit:", error);
    }
}

// Handle event update
const editEventForm = document.getElementById("edit-event-form");
if (editEventForm) {
    editEventForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const params = new URLSearchParams(window.location.search);
        const eventId = params.get("id");

        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();
        const date = document.getElementById("date").value;

        if (!title || !description || !date) {
            alert("All fields are required!");
            return;
        }

        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, date })
            });

            if (response.ok) {
                alert("Event updated successfully!");
                window.location.href = "index.html";
            } else {
                alert("Error updating event");
            }
        } catch (error) {
            console.error("Error updating event:", error);
        }
    });
}

// Handle event deletion
async function deleteEvent(eventId) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
        const response = await fetch(`/api/events/${eventId}`, { method: "DELETE" });

        if (response.ok) {
            alert("Event deleted successfully!");
            loadEvents();
        } else {
            alert("Error deleting event");
        }
    } catch (error) {
        console.error("Error deleting event:", error);
    }
}