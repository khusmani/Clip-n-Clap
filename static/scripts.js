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

function openHelpModal(type) {
    const modal = document.getElementById('helpModal');
    const title = document.getElementById('helpTitle');
    const content = document.getElementById('helpContent');
    const timsHelpContent = `Acceptable formats:  <br>
                            <ul style="margin-top: 8px;">
                                <li>✅ HH:MM:SS.mmm</li>
                                <li>✅ MM:SS.mmm</li>
                                <li>✅ SS.mmm</li>
                                <li>✅ HH:MM:SS</li>
                                <li>✅ MM:SS</li>
                                <li>✅ SS</li>
                            </ul>
                        `;

    const helpText = {
        urlHelp: {
            title: 'YouTube URL Help',
            content: 'Enter a valid YouTube video link, for example:<br><br> <code>https://www.youtube.com/watch?v=dQw4w9WgXcQ</code>'
        },
        startHelp: {
            title: 'Start Time Help',
            content: 'Specify when the clip should begin. ' + timsHelpContent
        },
        endHelp: {
            title: 'End Time Help',
            content: 'Specify when the clip should end. ' + timsHelpContent
        }
    };

    title.textContent = helpText[type].title;
    content.innerHTML = helpText[type].content;

    modal.classList.remove('hidden');
}

function closeHelpModal() {
    document.getElementById('helpModal').classList.add('hidden');
}


