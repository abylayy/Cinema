    document.addEventListener('DOMContentLoaded', () => {
        const contentTemplates = {
            'account': `<h2>Welcome!</h2>
          <div class="account-info">
            <div class="update-form">
              <label for="updatedFirstName">First Name:</label>
              <input type="text" id="updatedFirstName" class="input-field" placeholder="Enter updated first name">
    
              <label for="updatedLastName">Last Name:</label>
              <input type="text" id="updatedLastName" class="input-field" placeholder="Enter updated last name">
    
              <label for="updatedEmail">Email:</label>
              <input type="text" id="updatedEmail" class="input-field" placeholder="Enter updated email">
    
              <label for="updatedPassword">Password:</label>
              <input type="text" id="updatedPassword" class="input-field" placeholder="Enter updated password">
    
            </div>
                            <button id="updateAccountBtn">Update Account</button>
                            <button id="deleteAccountBtn">Delete Account</button>
                        </div>`,
            'mytickets': `<h2>My Tickets</h2>
                      <div class="tickets-container"></div>`,
            'feedback': `<h2>Feedback</h2>
                     <div class="feedback-form">
                        <textarea id="feedbackMessage" class="input-field"></textarea>
                        <button id="submitFeedbackBtn">Submit Feedback</button>
                     </div>`
        }

        const sidebarItems = document.querySelectorAll('.vertical-nav li');
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                const contentName = item.dataset.content;
                loadContent(contentName);
            });
        });

        loadContent(sidebarItems[0].dataset.content);

        function loadContent(contentName) {
            const accountDetails = document.querySelector('.account-details');
            if (contentTemplates.hasOwnProperty(contentName)) {
                accountDetails.innerHTML = contentTemplates[contentName];

                if (contentName === 'account') {
                    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
                    const updateAccountBtn = document.getElementById('updateAccountBtn');

                    if (deleteAccountBtn) {
                        deleteAccountBtn.addEventListener('click', () => {
                            const id = getUserId();
                            if (id) {
                                deleteAccount(id);
                            } else {
                                console.error('User ID not found');
                            }
                        });
                    }

                    if (updateAccountBtn) {
                        updateAccountBtn.addEventListener('click', () => {
                            const id = getUserId();
                            update(id);
                        });
                    }
                }

                if (contentName === 'feedback') {
                    const submitFeedbackBtn = document.getElementById('submitFeedbackBtn');
                    if (submitFeedbackBtn) {
                        submitFeedbackBtn.addEventListener('click', submitFeedback);
                    }
                }

                if (contentName === 'mytickets') {
                    fetchAndDisplayTickets();
                }

            } else {
                console.error(`Content template for '${contentName}' not found.`);
            }

        }

        function submitFeedback() {
            event.preventDefault();

            const feedbackMessage = document.getElementById("feedbackMessage").value;

            if (!feedbackMessage.trim()) {
                alert("Feedback cannot be empty. Please enter your feedback.");
                return;
            }

            axios.post('/submit-feedback', { userId: getUserId(), message: feedbackMessage })
                .then(response => {
                    console.log('Feedback submitted:', response.data);
                    alert('Thank you for your feedback!');

                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error submitting feedback:', error);
                    alert('Error submitting feedback. Please try again later.');
                });
        }
        async function fetchAndDisplayTickets() {
            const userId = getUserId();
            try {
                const ticketsResponse = await axios.get(`/bought-tickets/${userId}`);
                const tickets = ticketsResponse.data;

                for (const ticket of tickets) {
                    const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${ticket.movieId}?api_key=b743d7d019776f52a4f6cc05ddbb9cbb`);
                    ticket.movieTitle = movieResponse.data.title;
                }

                // Render tickets
                const ticketsContainer = document.querySelector('.tickets-container');
                ticketsContainer.innerHTML = tickets.map(ticket =>
                    `<div class="ticket">
                <p>Movie: ${ticket.movieTitle}</p>
                <p>Date: ${new Date(ticket.date).toLocaleDateString()}</p>
                <p>Time: ${ticket.time}</p>
                <p>Seats: ${ticket.seats.join(', ')}</p>
            </div>`).join('');

            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        }
    });
