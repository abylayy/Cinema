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
                          <p>Add or manage your payment methods here.</p>
                          <!-- Add your payment methods content here -->
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
        } else {
            console.error(`Content template for '${contentName}' not found.`);
            // Optionally display a message or handle the scenario where content is not found
        }
    }
});
