document.addEventListener("DOMContentLoaded", function() {

    // Function to clear selected seats
    function clearSelectedSeats() {
        let tickets = document.querySelectorAll(".all-seats input");
        tickets.forEach(ticket => {
            ticket.checked = false;
        });
        // Reset total ticket count and price
        document.querySelector(".amount").innerHTML = "0";
        document.querySelector(".count").innerHTML = "0";
    }

    // Select date elements
    let dates = document.querySelectorAll('input[name="date"]');
    // Add event listener to each date element
    dates.forEach(date => {
        date.addEventListener("click", () => {
            clearSelectedSeats();
        });
    });

    // Select time elements
    let times = document.querySelectorAll('input[name="time"]');
    // Add event listener to each time element
    times.forEach(time => {
        time.addEventListener("click", () => {
            clearSelectedSeats();
        });
    });

    // Select movie dropdown
    let movieSelect = document.getElementById("movie");
    // Add event listener to movie dropdown
    movieSelect.addEventListener("change", () => {
        clearSelectedSeats();
    });

    const initialMovieId = movieSelect.value;
    const initialTime = document.querySelector('input[name="time"]:checked').value;
    if (initialMovieId && initialTime) {
        updateBookedSeats(initialMovieId, initialTime);
    }

    // Dynamically add seat checkboxes
    let seats = document.querySelector(".all-seats");
    for (var i = 0; i < 60; i++) {
        let seat = "";
        seats.insertAdjacentHTML(
            "beforeend",
            '<input type="checkbox" name="tickets" id="s' +
            (i + 2) +
            '" /><label for="s' +
            (i + 2) +
            '" class="seat ' +
            seat +
            '"></label>'
        );
    }

    // Add event listener to each seat checkbox for updating total ticket count and price
    let tickets = seats.querySelectorAll("input");
    tickets.forEach(ticket => {
        ticket.addEventListener("change", () => {
            let amount = document.querySelector(".amount").innerHTML;
            let count = document.querySelector(".count").innerHTML;
            amount = Number(amount);
            count = Number(count);

            // Check if the seat is being selected or deselected
            if (ticket.checked) {
                // Check if selecting this seat would exceed the maximum number of seats (4)
                if (count >= 4) {
                    // If attempting to select a fifth seat, prevent selecting it and show an alert
                    ticket.checked = false;
                    alert("You can only select up to 4 seats.");
                } else {
                    // If not at the maximum, allow selecting the seat and update count and amount
                    count += 1;
                    amount += 200;
                }
            } else {
                // If the seat is being deselected, ensure count doesn't go negative
                if (count > 0) {
                    count -= 1;
                    amount -= 200;
                }
            }
            // Update total ticket count and price
            document.querySelector(".amount").innerHTML = amount;
            document.querySelector(".count").innerHTML = count;
        });
    });

    // Function to buy seats
    async function buySeats(userId, movieId, date, time, selectedSeats) {
        try {
            const response = await axios.post('/boughtSeats', {
                userId,
                movieId,
                date,
                time,
                seats: selectedSeats
            });
            console.log('Seats bought successfully:', response.data);
            alert("Successfully completed!");
            // window.location.reload();

        } catch (error) {
            console.error('Error buying seats:', error);
        }
    }

    function fetchAndDisplayBookedSeats(movieId, time) {
        axios.get(`/bookedSeats/${movieId}/${time}`)
            .then(response => {
                const bookedSeats = response.data; // Array of booked seat IDs

                // Mark each booked seat as unavailable
                bookedSeats.forEach(seatId => {
                    const seatCheckbox = document.getElementById(seatId);
                    if (seatCheckbox) {
                        seatCheckbox.disabled = true;
                        seatCheckbox.nextElementSibling.classList.add('booked');
                    }
                });
            })
            .catch(error => console.error('Error fetching booked seats:', error));
    }

    // Select movie dropdown
    movieSelect = document.getElementById("movie");
    // Add event listener to movie dropdown
    movieSelect.addEventListener("change", () => {
        clearSelectedSeats();
        const selectedMovieId = movieSelect.value;
        const selectedTime = document.querySelector('input[name="time"]:checked').value;
        fetchAndDisplayBookedSeats(selectedMovieId, selectedTime);
    });

    // Select time elements
    times = document.querySelectorAll('input[name="time"]');
    // Add event listener to each time element
    times.forEach(time => {
        time.addEventListener("click", () => {
            clearSelectedSeats();
            const selectedMovieId = movieSelect.value;
            const selectedTime = time.value;
            fetchAndDisplayBookedSeats(selectedMovieId, selectedTime);
        });
    });

    // Call buySeats function when the user clicks the "Book" button
    const bookingButton = document.getElementById("bookingButton");

    // Add event listener to the booking button
    if (bookingButton) {
        bookingButton.addEventListener("click", async () => {
            // Get the user ID
            const userId = getUserId();

            // Check if user is authenticated
            if (!userId) {
                alert("Please log in to book tickets.");
                return;
            }

            // Get selected date and time
            const date = document.querySelector('input[name="date"]:checked').value;
            const time = document.querySelector('input[name="time"]:checked').value;

            // Get selected movie ID
            const movieId = document.getElementById("movie").value;

            // Get selected seats
            const selectedSeats = Array.from(document.querySelectorAll('input[name="tickets"]:checked')).map(seat => seat.id);

            // Call the buySeats function with the user ID, movie ID, date, time, and selected seats
            try {
                await initiatePayPalPayment();
                await buySeats(userId, movieId, date, time, selectedSeats);
            } catch (error) {
                console.error("Payment failed:", error);
            }
        });
    }
    function updateBookedSeats() {
        const selectedMovieId = movieSelect.value;
        const selectedDate = document.querySelector('input[name="date"]:checked').value;
        const selectedTime = document.querySelector('input[name="time"]:checked').value;

        if (selectedMovieId && selectedDate && selectedTime) {
            axios.get(`/bookedSeats/${selectedMovieId}/${selectedDate}/${selectedTime}`)
                .then(response => {
                    const bookedSeats = response.data;
                    // First, reset all seats to unbooked
                    document.querySelectorAll(".all-seats input").forEach(seat => {
                        seat.disabled = false;
                        seat.nextElementSibling.classList.remove('booked');
                    });
                    // Then, mark fetched seats as booked
                    bookedSeats.forEach(seatId => {
                        const seatCheckbox = document.getElementById(seatId);
                        if (seatCheckbox) {
                            seatCheckbox.disabled = true;
                            seatCheckbox.nextElementSibling.classList.add('booked');
                        }
                    });
                })
                .catch(error => console.error('Error fetching booked seats:', error));
        }
    }

    movieSelect.addEventListener('change', () => {
        clearSelectedSeats();
        const selectedMovieId = movieSelect.value;
        const selectedTime = document.querySelector('input[name="time"]:checked')?.value;
        if (selectedMovieId && selectedTime) {
            updateBookedSeats(selectedMovieId, selectedTime);
        }
    });

    times.forEach(time => {
        time.addEventListener('change', () => {
            clearSelectedSeats();
            const selectedMovieId = movieSelect.value;
            const selectedTime = time.value;
            if (selectedMovieId && selectedTime) {
                updateBookedSeats(selectedMovieId, selectedTime);
            }
        });
    });

    function initiatePayPalPayment() {
        // AJAX call to your server to create a PayPal payment
        $.ajax({
            url: '/create-paypal-payment',
            type: 'POST',
            success: function(response) {
                // Redirect to PayPal payment page
                window.location.href = response;
            },
            error: function(error) {
                // Handle errors here
                console.log(error);
            }
        });
    }



    paypal.Buttons({
        createOrder: function(data, actions) {
            // Set up the transaction
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: '0.01'
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            // Capture the funds from the transaction
            return actions.order.capture().then(function(details) {
                // Show a success message to your buyer
                alert('Transaction completed by ' + details.payer.name.given_name);
                // Optional: Call your server to save the transaction
                return fetch('/paypal-transaction-complete', {
                    method: 'post',
                    body: JSON.stringify({
                        orderID: data.orderID
                    })
                });
            });
        }
    }).render('#paypal-button-container');

});
