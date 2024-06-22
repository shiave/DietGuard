document.addEventListener('DOMContentLoaded', () => {
  const addAllergenButton = document.getElementById('addAllergen');
  const checkPageButton = document.getElementById('checkPage');

  if (addAllergenButton) {
    addAllergenButton.addEventListener('click', () => {
      const customAllergen = document.getElementById('customAllergen').value.trim();
      if (customAllergen) {
        chrome.storage.local.get(['customAllergens'], (result) => {
          const customAllergens = result.customAllergens || [];
          customAllergens.push(customAllergen);
          chrome.storage.local.set({ customAllergens: customAllergens }, () => {
            console.log('Custom allergen added:', customAllergen); // Debug log
            updateCustomAllergenList();
            document.getElementById('customAllergen').value = '';
          });
        });
      }
    });
  }

  if (checkPageButton) {
    checkPageButton.addEventListener('click', () => {
      const selectedAllergens = [];
      document.querySelectorAll('input[name="allergen"]:checked').forEach((checkbox) => {
        selectedAllergens.push(checkbox.value);
      });

      chrome.storage.local.set({ allergens: selectedAllergens }, () => {
        console.log('Selected allergens stored:', selectedAllergens); // Debug log
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['content.js']
          }, () => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message); // Debug log
            } else {
              console.log('Content script executed'); // Debug log
            }
          });
        });
      });
    });
  }

  function updateCustomAllergenList() {
    chrome.storage.local.get(['customAllergens'], (result) => {
      const customAllergens = result.customAllergens || [];
      const customAllergenList = document.getElementById('customAllergenList');
      customAllergenList.innerHTML = '';
      customAllergens.forEach(allergen => {
        const item = document.createElement('div');
        item.textContent = allergen;
        customAllergenList.appendChild(item);
      });
    });
  }

  // Initialize the custom allergen list on popup load
  updateCustomAllergenList();
});
