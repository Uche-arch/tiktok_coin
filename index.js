document.addEventListener("DOMContentLoaded", function () {
  const priceCards = document.querySelectorAll(".price");
  const totalDisplay = document.getElementById("total");
  const rechargeButton = document.querySelector(".recharge-btn");
  const customCard = document.getElementById("custom");
  const customH2 = customCard.querySelector("h2");
  const audio = new Audio("./sounds/cash.mp3");
  audio.volume = 0.3; // Range is 0.0 (silent) to 1.0 (full volume)

  let lastSelectedTotal = ""; // For fallback if custom is unselected

  // Modal elements
  const successModal = document.getElementById("successModal");
  const closeModalButton = document.getElementById("closeModal");
  const paymentMessage = document.getElementById("paymentMessage");

  // Disable button initially
  rechargeButton.disabled = true;
  rechargeButton.style.opacity = 0.4;

  priceCards.forEach(function (card) {
    card.addEventListener("click", function () {
      // Reset all cards
      priceCards.forEach((c) => {
        c.classList.remove("selected");
        if (c.id === "custom") resetCustomCard();
      });

      // Select current card
      card.classList.add("selected");

      // Handle regular cards
      if (card.id !== "custom") {
        const totalFee = card.querySelector(".total-fee").textContent;
        totalDisplay.textContent = totalFee;
        lastSelectedTotal = totalFee;

        // Enable button
        rechargeButton.disabled = false;
        rechargeButton.style.opacity = 1;
      } else {
        // Handle custom card
        customH2.style.display = "none";
        totalDisplay.textContent = "NGN0";
        lastSelectedTotal = "";

        // Only add input once
        if (!card.querySelector("input")) {
          const input = document.createElement("input");
          input.type = "number";
          input.style.padding = "4px";
          input.style.fontSize = "1.2rem";
          input.style.border = "none";
          input.style.outline = "none";
          input.style.textAlign = "center";
          input.style.width = "80%";
          card.appendChild(input);
          input.focus();

          input.addEventListener("input", function () {
            const value = parseFloat(input.value);
            const result = isNaN(value) || value <= 0 ? 0 : value * 2;
            totalDisplay.textContent = formatCurrency(result);

            // Enable button only when value is valid
            if (value > 0) {
              rechargeButton.disabled = false;
              rechargeButton.style.opacity = 1;
            } else {
              rechargeButton.disabled = true;
              rechargeButton.style.opacity = 0.4;
            }
          });
        }

        // Disable button initially when switching to custom
        rechargeButton.disabled = true;
        rechargeButton.style.opacity = 0.4;
      }
    });
  });

  // Recharge button click = show modal
  rechargeButton.addEventListener("click", function () {
    audio.play();
    paymentMessage.textContent = `You have successfully paid ${totalDisplay.textContent} to Uche Godswill😎`;
    successModal.style.display = "block";
  });

  // Close modal
  closeModalButton.addEventListener("click", function () {
    successModal.style.display = "none";
  });

  // Reset custom card when clicking outside
  document.addEventListener("click", function (e) {
    if (!customCard.contains(e.target)) {
      if (customCard.classList.contains("selected")) {
        resetCustomCard();
        customCard.classList.remove("selected");

        // Restore previous total and button state
        if (lastSelectedTotal) {
          totalDisplay.textContent = lastSelectedTotal;
          rechargeButton.disabled = false;
          rechargeButton.style.opacity = 1;
        } else {
          totalDisplay.textContent = "";
          rechargeButton.disabled = true;
          rechargeButton.style.opacity = 0.4;
        }
      }
    }
  });

  function resetCustomCard() {
    const input = customCard.querySelector("input");
    if (input) input.remove();

    customH2.style.display = "block";

    rechargeButton.disabled = true;
    rechargeButton.style.opacity = 0.4;
  }

  function formatCurrency(value) {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(value);
  }
});
