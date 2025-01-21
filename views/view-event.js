// Fetch event details based on the event ID
const eventId = new URLSearchParams(window.location.search).get('id');
if (!eventId) {
  alert('No event ID provided!');
  window.location.href = 'index.html';
}

async function fetchEventDetails() {
  try {
    const response = await fetch(`/api/events/${eventId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event details');
    }
    const event = await response.json();
    document.getElementById('event-title').textContent = event.title;
    document.getElementById('event-date').textContent = `Date: ${new Date(event.date).toLocaleDateString()}`;
    document.getElementById('event-description').textContent = event.description;
    document.getElementById('edit-button').href = `edit-event.html?id=${eventId}`;
  } catch (error) {
    console.error(error);
    alert('Error fetching event details');
    window.location.href = 'index.html';
  }
}

fetchEventDetails();

// Handle delete event
document.getElementById('delete-button').addEventListener('click', async () => {
  if (confirm('Are you sure you want to delete this event?')) {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Event deleted successfully!');
        window.location.href = 'index.html';
      } else {
        alert('Failed to delete event');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the event');
    }
  }
});