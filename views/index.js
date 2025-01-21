async function fetchEvents() {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const events = await response.json();

      const container = document.getElementById('events-container');
      container.innerHTML = '';

      if (events.length === 0) {
        container.innerHTML = '<p>No events found.</p>';
        return;
      }

      events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
          <h3>${event.title}</h3>
          <p>${new Date(event.date).toLocaleDateString()}</p>
          <div class="card-actions">
            <a href="view-event.html?id=${event.id}" class="view-button">View</a>
            <a href="edit-event.html?id=${event.id}" class="edit-button">Edit</a>
            <button class="delete-button" data-id="${event.id}">Delete</button>
          </div>
        `;
        container.appendChild(eventCard);
      });

      // Attach delete event handlers
      document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', async () => {
          const eventId = button.getAttribute('data-id');
          if (confirm('Are you sure you want to delete this event?')) {
            try {
              const deleteResponse = await fetch(`/api/events/${eventId}`, {
                method: 'DELETE',
              });
              if (deleteResponse.ok) {
                alert('Event deleted successfully');
                fetchEvents();
              } else {
                alert('Failed to delete event');
              }
            } catch (error) {
              console.error(error);
              alert('Error deleting event');
            }
          }
        });
      });
    } catch (error) {
      console.error(error);
      document.getElementById('events-container').innerHTML = '<p>Error loading events.</p>';
    }
  }

  // Fetch and display events on page load
  fetchEvents();