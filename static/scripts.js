function addUrlDiv() {
    const template = document.getElementById('urlDivTemplate');
    const clone = template.cloneNode(true);

    // Clear input values
    clone.querySelectorAll('input').forEach(input => input.value = "");

    // Add remove button
    const removeBtn = document.createElement("button");
    removeBtn.innerText = " ❌ ";
    removeBtn.type = "button";
    removeBtn.className = "remove-btn";
    removeBtn.onclick = () => clone.remove();
    clone.appendChild(removeBtn);

    // Insert above the Add button
    const addBtnWrapper = document.getElementById('addBtnWrapper');
    addBtnWrapper.parentNode.insertBefore(clone, addBtnWrapper);
}

function showLoader() {
    //alert('Here');
    document.getElementById('overlay').style.display = 'flex';
}

function copyToClipboard(copyText, btn) {
  // Copy the text to the clipboard using the Clipboard API
  navigator.clipboard.writeText(copyText).then(() => {
      console.log("Text copied to clipboard successfully!");
      //alert("Text copied: " + copyText);
      let copiedDiv = btn.nextElementSibling;
      copiedDiv.style.display = "block";

      // Hide after 1 second
      setTimeout(() => {
         copiedDiv.style.display = "none";
      }, 1000);
    })
    .catch(err => {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy text.");
    });
}

