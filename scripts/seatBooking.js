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
            // Add any additional logic here, such as updating UI or showing a success message
        } catch (error) {
            console.error('Error buying seats:', error);
            // Handle error, such as displaying an error message to the user
        }
    }

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

            // Call the buySeats function with the user ID
            await buySeats(userId, movieId, date, time, selectedSeats);
        });
    }
});
