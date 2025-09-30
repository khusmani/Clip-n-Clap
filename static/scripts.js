function addUrlDiv() {
    const template = document.getElementById('urlDivTemplate');
    const clone = template.cloneNode(true);

    // Clear input values
    clone.querySelectorAll('input').forEach(input => input.value = "");

    // Add remove button
    const removeBtn = document.createElement("button");
    removeBtn.innerText = "❌ Remove";
    removeBtn.type = "button";
    removeBtn.className = "remove-btn";
    removeBtn.onclick = () => clone.remove();
    clone.appendChild(removeBtn);

    // Insert above the Add button
    const addBtnWrapper = document.getElementById('addBtnWrapper');
    addBtnWrapper.parentNode.insertBefore(clone, addBtnWrapper);
}
