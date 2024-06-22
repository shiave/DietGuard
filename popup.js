document.getElementById('addAllergen').addEventListener('click', () => {
    let customAllergen = document.getElementById('customAllergen').value.trim();
    if (customAllergen) {
      chrome.storage.local.get(['customAllergens'], (result) => {
        let customAllergens = result.customAllergens || [];
        customAllergens.push(customAllergen);
        chrome.storage.local.set({ customAllergens: customAllergens }, () => {
          // Update the custom allergen list display
          updateCustomAllergenList();
          document.getElementById('customAllergen').value = '';
        });
      });
    }
  });
  
  function updateCustomAllergenList() {
    chrome.storage.local.get(['customAllergens'], (result) => {
      let customAllergens = result.customAllergens || [];
      let customAllergenList = document.getElementById('customAllergenList');
      customAllergenList.innerHTML = '';
      customAllergens.forEach(allergen => {
        let item = document.createElement('div');
        item.textContent = allergen;
        customAllergenList.appendChild(item);
      });
    });
  }
  
  // Initialize the custom allergen list on popup load
  document.addEventListener('DOMContentLoaded', updateCustomAllergenList);
  
  document.getElementById('checkPage').addEventListener('click', () => {
    let selectedAllergens = [];
    document.querySelectorAll('input[name="allergen"]:checked').forEach((checkbox) => {
      selectedAllergens.push(checkbox.value);
    });
  
    // Store the selected allergens in storage
    chrome.storage.local.set({ allergens: selectedAllergens }, () => {
      // Send a message to the content script to check the page
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['content.js']
        });
      });
    });
  });
  