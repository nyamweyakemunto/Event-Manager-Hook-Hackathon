 // Fetch event details and populate form
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
     document.getElementById('title').value = event.title;
     document.getElementById('description').value = event.description;
     document.getElementById('date').value = event.date;
   } catch (error) {
     console.error(error);
     alert('Error fetching event details');
   }
 }

 fetchEventDetails();

 // Handle form submission
 document.getElementById('edit-event-form').addEventListener('submit', async (e) => {
   e.preventDefault();

   const title = document.getElementById('title').value;
   const description = document.getElementById('description').value;
   const date = document.getElementById('date').value;

   try {
     const response = await fetch(`/api/events/${eventId}`, {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ title, description, date }),
     });

     if (response.ok) {
       alert('Event updated successfully!');
       window.location.href = 'index.html';
     } else {
       alert('Failed to update event');
     }
   } catch (error) {
     console.error(error);
     alert('An error occurred while updating the event');
   }
 });