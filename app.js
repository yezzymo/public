document.getElementById("notification-box").addEventListener("submit", function(event) {
  event.preventDefault();

  const list = document.getElementById("myList");
  const itemsArray = JSON.parse(localStorage.getItem('itemsArray')) || [];
  const inputField = document.getElementById("addTask");
  const inputValue = inputField.value.trim();

  if (inputValue !== "") {
    // Add the input value to the array along with a checked property
    itemsArray.push({ text: inputValue, checked: false });

    // Save the updated array to local storage
    localStorage.setItem('itemsArray', JSON.stringify(itemsArray));

    // Clear the input field
    inputField.value = "";

    // Render the updated list
    renderList();
  }
});

function renderList() {
  const list = document.getElementById("myList");
  const itemsArray = JSON.parse(localStorage.getItem('itemsArray')) || [];

  list.innerHTML = ""; // Clear the current list

  // Loop through the array and create list items
  itemsArray.forEach(function(item, index) {
    const listItem = document.createElement("li");
    const customInput = document.createElement("input");
    const inputParagraph = document.createElement("p");
    customInput.type = "checkbox";
    customInput.id = `customCheckbox_${index}`;
    customInput.checked = item.checked; // Set the checkbox state

    if (item.checked) {
      customInput.checked = true;
      inputParagraph.classList.add("inputChecked");
    } else {
      customInput.checked = false;
      inputParagraph.classList.remove("inputChecked");
    }
    
    
    customInput.addEventListener('click', function() {
      itemsArray[index].checked = customInput.checked;

      if (customInput.checked) {
        item.class = "inputChecked";

      } else {
        item.class = "";
      }

      // Update local storage
      localStorage.setItem('itemsArray', JSON.stringify(itemsArray));

      if (customInput.checked) {
        inputParagraph.classList.add("inputChecked");
      } else {
        inputParagraph.classList.remove("inputChecked");
      }
    });


    const removeItem = document.createElement("i");
    removeItem.classList.add("far", "fa-trash-alt", "fa-xl");
    removeItem.addEventListener('click', function() {
      itemsArray.splice(index, 1);

      // Update local storage
      localStorage.setItem('itemsArray', JSON.stringify(itemsArray));

      // Re-render the list
      renderList();
    });

    listItem.classList.add("message-box", "blue", "user-message");
    inputParagraph.innerText = item.text;
    // Append the custom checkbox and remove button to the list item
    listItem.appendChild(customInput);
    listItem.appendChild(inputParagraph);
    listItem.appendChild(removeItem);
    list.prepend(listItem); // Append the list item to the unordered list
  });
}

// Initially render the list when the page loads
renderList();

