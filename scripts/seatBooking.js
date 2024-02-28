let movieSelect = 0
let selectedDate = document.querySelector('input[name="date"]:checked').value;
let selectedTime = document.querySelector('input[name="date"]:checked').value;
document.addEventListener("DOMContentLoaded", function() {

    const movieSelectEvent = document.getElementById("movie");

    for (let i = 0; i < movieSelectEvent.length; i++) {
        const movieSelectElement = movieSelectEvent[i];
        movieSelectElement.addEventListener("change", () => {
            clearSelectedSeats();

            let selectedOption = movieSelectElement.options[movieSelectElement.selectedIndex];
            if (selectedOption) {
                movieSelect = selectedOption.value;
                console.log(`Selected Movie ID for dropdown ${i + 1}:`, movieSelect);
            } else {
                console.log(`No option selected for dropdown ${i + 1}`);
            }
        });
    }

    movieSelectEvent.addEventListener("change", function() {
        clearSelectedSeats();
        movieSelect = this.value;
        console.log(movieSelect)
        selectedDate = document.querySelectorAll('input[name="date"]:checked').value;
        selectedTime = document.querySelector('input[name="time"]:checked').value;
        fetchAndDisplayBookedSeats(movieSelect, selectedDate, selectedTime);
    });

    movieSelectEvent.addEventListener("click", function() {
        clearSelectedSeats();
        movieSelect = this.value;
        console.log(movieSelect)
        selectedDate = document.querySelector('input[name="date"]:checked').value;
        selectedTime = document.querySelector('input[name="time"]:checked').value;
        if (movieSelect && selectedDate && selectedTime) {
            updateBookedSeats(movieSelect, selectedDate, selectedTime);
        }

    });

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




    function init() {
        clearSelectedSeats();
        const initialMovieId = movieSelect;
        const initialDate = document.querySelector('input[name="date"]:checked').value;
        const initialTime = document.querySelector('input[name="time"]:checked').value;
        console.log(initialMovieId, initialDate, initialTime)
        if (initialMovieId && initialDate && initialTime) {
            updateBookedSeats(initialMovieId, initialDate, initialTime);
        }
    }

    init()


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
            window.location.reload();
            alert("Successfully completed!");

        } catch (error) {
            console.error('Error buying seats:', error)
        }
    }

    function fetchAndDisplayBookedSeats(movieId, date, time) {

        axios.get(`/bookedSeats/${movieId}/${date}/${time}`)
            .then(response => {
                const bookedSeats = response.data;

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

    // Select time elements
    times = document.querySelectorAll('input[name="time"]');
    // Add event listener to each time element
    times.forEach(time => {
        time.addEventListener("click", () => {
            clearSelectedSeats();
            selectedMovieId = movieSelect;
            selectedDate = document.querySelector('input[name="date"]:checked').value;
            selectedTime = time.value;
            fetchAndDisplayBookedSeats(selectedMovieId, selectedDate, selectedTime);
        });
    });

    times.forEach(time => {
        time.addEventListener('change', () => {
            clearSelectedSeats();
            selectedMovieId = movieSelect;
            selectedDate = document.querySelector('input[name="date"]:checked')?.value;
            selectedTime = time.value;
            if (selectedMovieId && selectedDate && selectedTime) {
                updateBookedSeats(selectedMovieId, selectedDate, selectedTime);
            }
        });
    });

    dates = document.querySelectorAll('input[name="date"]');
    // Add event listener to each time element
    dates.forEach(date => {
        date.addEventListener("click", () => {
            clearSelectedSeats();
            selectedMovieId = movieSelect;
            selectedDate = date.value;
            selectedTime = document.querySelector('input[name="time"]:checked').value;
            fetchAndDisplayBookedSeats(selectedMovieId, selectedDate, selectedTime);
        });
    });

    dates.forEach(date => {
        date.addEventListener('change', () => {
            clearSelectedSeats();
            selectedMovieId = movieSelect;
            selectedDate = date.value;
            selectedTime = document.querySelector('input[name="time"]:checked')?.value;
            if (selectedMovieId && selectedDate && selectedTime) {
                updateBookedSeats(selectedMovieId, selectedDate, selectedTime);
            }
        });
    });

    // Call buySeats function when the user clicks the "Book" button
    const bookingButton = document.getElementById("bookingButton");

    // Add event listener to the booking button
    let paymentMethodChosen = false; // Add this variable to track if payment method has been chosen

// Add event listener to the booking button
    if (bookingButton) {
        bookingButton.addEventListener("click", async () => {
            // Get the user ID
            const userId = getUserId();

            if(movieSelect === 0) {
                alert("Please select the movie.")
                return
            }
            let checked = false
            tickets.forEach(ticket => {
                if(ticket.checked) {
                    checked = true
                }
            })

            if(!checked) {
                alert("Please choose the seats.")
                return
            }

            // Check if user is authenticated
            if (!userId) {
                alert("Please log in to book tickets.");
                return;
            }

            // Check if payment method has already been chosen
            if (paymentMethodChosen) {
                alert("Please choose the payment method.");
                return;
            }

            // Get selected date and time
            const date = document.querySelector('input[name="date"]:checked').value;
            const time = document.querySelector('input[name="time"]:checked').value;

            // Get selected seats
            const selectedSeats = Array.from(document.querySelectorAll('input[name="tickets"]:checked')).map(seat => seat.id);

            // Render PayPal buttons only if payment method has not been chosen yet
            if (!paymentMethodChosen) {
                renderPayPalButtons();
            }
            paymentMethodChosen = true;

            // Function to initiate the PayPal payment process
            function renderPayPalButtons() {
                paypal.Buttons({
                    createOrder: function(data, actions) {
                        // Set up the transaction
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: '0.01' // Replace with the actual amount based on selected seats
                                }
                            }]
                        });
                    },
                    onApprove: function(data, actions) {
                        // Capture the funds from the transaction
                        return actions.order.capture().then(function(details) {
                            // Show a success message to the buyer
                            alert('Transaction completed by ' + details.payer.name.given_name);
                            // Call your server to save the transaction
                            return fetch('/paypal-transaction-complete', {
                                method: 'post',
                                body: JSON.stringify({
                                    orderID: data.orderID
                                })
                            }).then(() => {
                                // After successful payment, proceed to book seats
                                buySeats(userId, movieSelect, date, time, selectedSeats);
                                paymentMethodChosen = true; // Update payment method chosen status
                            });
                        });
                    }
                }).render('#paypal-button-container');
            }
        });
    }
    function updateBookedSeats(selectedMovieId, selectedDate, selectedTime) {

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

});

