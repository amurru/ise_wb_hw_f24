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
    // Function to apply filters
    function applyFilters() {
      const searchTerm = document.getElementById("searchInput").value.toLowerCase();
      const categoryFilter = document.getElementById("categoryFilter").value.toLowerCase();
      const dateFilter = document.getElementById("dateFilter").value;
      const allEvents = document.querySelectorAll(".event-item");

      allEvents.forEach(function(event) {
        const eventCategory = event.getAttribute("data-category").toLowerCase();
        const eventTitle = event.querySelector(".card-title").textContent.toLowerCase();
        const eventDesc = event.querySelector(".card-text:not(.text-muted)").textContent.toLowerCase();
        const eventDateText = event.querySelector(".text-muted").textContent;
        const eventDate = eventDateText.match(/التاريخ:\s*(\d+)\s+(\w+)\s+(\w+)\s+(\d+)/);
        let eventDateISO = "";
        if (eventDate) {
          const day = eventDate[1];
          const monthPart1 = eventDate[2];
          const monthPart2 = eventDate[3];
          const year = eventDate[4];
          let month = "01";
          if (monthPart1 === "تشرين") {
            month = monthPart2 === "الأول" ? "10" : "11";
          } else {
            const monthMap = {
              "كانون": monthPart2 === "الأول" ? "12" : "01", // Assuming كانون الأول is Dec, كانون الثاني Jan
              "شباط": "02", "آذار": "03", "نيسان": "04", "أيار": "05", "حزيران": "06",
              "تموز": "07", "آب": "08", "أيلول": "09"
            };
            month = monthMap[monthPart1] || "01";
          }
          eventDateISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }

        let show = true;

        // Category filter
        if (categoryFilter !== "all" && eventCategory !== categoryFilter) {
          show = false;
        }

        // Search filter
        if (searchTerm && !eventTitle.includes(searchTerm) && !eventDesc.includes(searchTerm)) {
          show = false;
        }

        // Date filter
        if (dateFilter && eventDateISO !== dateFilter) {
          show = false;
        }

        event.style.display = show ? "block" : "none";
      });
    }

    // Restore filters from localStorage
    const savedSearch = localStorage.getItem("eventSearch");
    const savedCategory = localStorage.getItem("eventCategory");
    const savedDate = localStorage.getItem("eventDate");
    if (savedSearch) document.getElementById("searchInput").value = savedSearch;
    if (savedCategory) document.getElementById("categoryFilter").value = savedCategory;
    if (savedDate) document.getElementById("dateFilter").value = savedDate;

    // Apply filters on load if any saved
    if (savedSearch || savedCategory !== "all" || savedDate) {
      applyFilters();
    }

    filterBtn.addEventListener("click", function() {
      // Save to localStorage
      const searchVal = document.getElementById("searchInput").value;
      const categoryVal = document.getElementById("categoryFilter").value;
      const dateVal = document.getElementById("dateFilter").value;
      localStorage.setItem("eventSearch", searchVal);
      localStorage.setItem("eventCategory", categoryVal);
      localStorage.setItem("eventDate", dateVal);

      applyFilters();
    });

    // Clear filters button
    const clearBtn = document.getElementById("clearBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", function() {
        document.getElementById("searchInput").value = "";
        document.getElementById("categoryFilter").value = "all";
        document.getElementById("dateFilter").value = "";
        localStorage.removeItem("eventSearch");
        localStorage.removeItem("eventCategory");
        localStorage.removeItem("eventDate");
        applyFilters();
      });
    }
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
