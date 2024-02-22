    document.addEventListener('DOMContentLoaded', () => {
        const contentTemplates = {
            'account': `<h2>Hello, !</h2>
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
            'mytickets': `<h2>My Tickets</h2>`,
            'feedback': `<h2>Feedback</h2>
                     <div class="feedback-form">
                        <textarea id="feedbackMessage" class="input-field"></textarea>
                        <button id="submitFeedbackBtn">Submit Feedback</button>
                     </div>`,
            'paymentmethods': `<h2>Payment Methods</h2>
                            <div class="payment-methods-info">
                                <form id="payment-method-form">
                                    <label for="card-number">Card Number:</label>
                                    <input type="text" id="card-number" class="input-field" placeholder="Enter card number" required>
    
                                    <label for="expiry-date">Expiry Date:</label>
                                    <input type="text" id="expiry-date" class="input-field" placeholder="MM/YY" required>
    
                                    <label for="cvv">CVV:</label>
                                    <input type="text" id="cvv" class="input-field" placeholder="Enter CVV" required>
    
                                    <input type="submit" value="Add Payment Method">
                                </form>
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
            } else {
                console.error(`Content template for '${contentName}' not found.`);
            }

            if (contentName === 'paymentmethods') {
                const paymentForm = document.getElementById('payment-method-form');
                if (paymentForm) {
                    paymentForm.addEventListener('submit', submitPaymentMethod);
                }
            }
        }

        function submitFeedback() {
            event.preventDefault();

            const feedbackMessage = document.getElementById("feedbackMessage").value;

            if (!feedbackMessage.trim()) {
                alert("Feedback cannot be empty. Please enter your feedback.");
                return;
            }

            axios.post('/api/submit-feedback', { message: feedbackMessage })
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

        function submitPaymentMethod(event) {
            event.preventDefault();
            const cardNumber = document.getElementById('card-number').value;
            const expiryDate = document.getElementById('expiry-date').value;
            const cvv = document.getElementById('cvv').value;
            const userId = getUserId();

            axios.post('/api/user/add-payment-method', { userId, cardNumber, expiryDate, cvv })
                .then(response => {
                    alert('Payment method added successfully');
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error adding payment method:', error);
                    alert('Failed to add payment method');
                });
        }
    });
