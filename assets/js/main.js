/*
  Title: ISE WB HW - F24
  File: main.js
  Description: This file handles the interactive functionalities for the City Events Guide website.
  - Contact Form Validation: Validates the form fields on the contact page.
  - Event Filtering: Provides a simple client-side filter for the events page.
*/

document.addEventListener("DOMContentLoaded", function() {
  // --- Contact Form Validation ---
  // This logic only runs if the contact form exists on the current page.
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
      // Prevent the default form submission behavior.
      event.preventDefault();
      event.stopPropagation();

      // Check if the form is valid according to HTML5 constraints (like `required`, `type="email"`).
      if (contactForm.checkValidity()) {
        // If the form is valid, show a success message.
        showAlert("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.", "success");
        // Reset the form fields after successful submission.
        contactForm.reset();
        contactForm.classList.remove("was-validated");
      } else {
        // If the form is invalid, show an error message.
        showAlert("الرجاء التأكد من تعبئة جميع الحقول بشكل صحيح.", "danger");
      }

      // Add Bootstrap's validation classes to show feedback to the user.
      contactForm.classList.add("was-validated");
    });
  }

  // --- Simple Event Filtering ---
  // This logic only runs if the filter button exists on the events page.
  const filterBtn = document.getElementById("filterBtn");
  if (filterBtn) {
    filterBtn.addEventListener("click", function() {
      const categoryFilter = document
        .getElementById("categoryFilter")
        .value.toLowerCase();
      const allEvents = document.querySelectorAll(".event-item");

      allEvents.forEach(function(event) {
        const eventCategory = event.getAttribute("data-category").toLowerCase();

        // Show or hide events based on the selected category.
        // If "all" is selected, or if the event's category matches the filter, show it.
        if (categoryFilter === "all" || eventCategory === categoryFilter) {
          event.style.display = "block"; // Show the event card
        } else {
          event.style.display = "none"; // Hide the event card
        }
      });
    });
  }

  // --- Scroll to Top Button ---
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  if (scrollToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", function() {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add("show");
      } else {
        scrollToTopBtn.classList.remove("show");
      }
    });

    // Scroll to top on click
    scrollToTopBtn.addEventListener("click", function() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // --- Dark Mode Toggle ---
  const darkModeToggle = document.getElementById("darkModeToggle");
  if (darkModeToggle) {
    // Load saved preference
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      darkModeToggle.textContent = "☀️";
    } else {
      darkModeToggle.textContent = "🌙";
    }

    // Toggle on click
    darkModeToggle.addEventListener("click", function() {
      const isDark = document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", isDark);
      darkModeToggle.textContent = isDark ? "☀️" : "🌙";
    });
  }
});

/**
 * A helper function to display Bootstrap alerts.
 * @param {string} message - The message to be displayed in the alert.
 * @param {string} type - The type of the alert (e.g., 'success', 'danger', 'info').
 */
function showAlert(message, type) {
  const alertContainer = document.getElementById("alert-container");
  if (alertContainer) {
    const alertWrapper = document.createElement("div");
    alertWrapper.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    // Clear any previous alerts and append the new one.
    alertContainer.innerHTML = "";
    alertContainer.append(alertWrapper);
  }
}
