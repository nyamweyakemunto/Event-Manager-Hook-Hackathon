document.addEventListener("DOMContentLoaded", () => {
    const eventForm = document.getElementById("event-form");
    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");
    const dateInput = document.getElementById("date");
    const messageBox = document.getElementById("message-box");

    eventForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Get form values
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const date = dateInput.value;

        // Validate input fields
        if (!title || !description || !date) {
            showMessage("All fields are required!", "error");
            return;
        }

        // Ensure the event date is in the future
        const today = new Date().toISOString().split("T")[0];
        if (date < today) {
            showMessage("Event date must be in the future!", "error");
            return;
        }

        // Prepare event data
        const eventData = { title, description, date };

        try {
            const response = await fetch("/add-event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventData),
            });

            const result = await response.json();

            if (response.ok) {
                showMessage("Event added successfully!", "success");
                eventForm.reset();
            } else {
                showMessage(result.error || "Failed to add event.", "error");
            }
        } catch (error) {
            console.error("Error adding event:", error);
            showMessage("An error occurred. Please try again later.", "error");
        }
    });

    // Function to show messages
    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = `message ${type}`;
        setTimeout(() => {
            messageBox.textContent = "";
            messageBox.className = "message";
        }, 3000);
    }
});