document.addEventListener('DOMContentLoaded', () => {
  const addAllergenButton = document.getElementById('addAllergen');
  const checkPageButton = document.getElementById('checkPage');

  // new conditions that do automatically add allergies for the user
  const vegan = document.getElementById('Vegan');
  const vegetarian = document.getElementById('Vegetarian');
  const glutenFree = document.getElementById('Gluten-Free');
  const diabetic = document.getElementById('Diabetic');
  const kosher = document.getElementById('Kosher');

  // Function to update custom allergen list in the popup
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

  // Function to modify custom allergens based on the checkbox state
  function modifyCustomAllergens(checkbox, allergensToAdd, allergensToRemove) {
    chrome.storage.local.get(['customAllergens'], (result) => {
      let customAllergens = result.customAllergens || [];

      if (checkbox.checked) {
        allergensToAdd.forEach(allergen => {
          if (!customAllergens.includes(allergen)) {
            customAllergens.push(allergen);
          }
        });
      } else {
        allergensToRemove.forEach(allergen => {
          customAllergens = customAllergens.filter(item => item !== allergen);
        });
      }

      chrome.storage.local.set({ customAllergens: customAllergens }, () => {
        updateCustomAllergenList();
      });
    });
  }

  // Add event listeners for each dietary restriction checkbox
  if (vegan) {
    vegan.addEventListener('change', () => {
      const allergensToAdd = ['eggs', 'milk', 'meat', 'beef', 'pork', 'gelatin', 'chicken', 'turkey', 'duck', 'goose', 'lamb', 'mutton'];
      modifyCustomAllergens(vegan, allergensToAdd, allergensToAdd);
    });
  }

  if (vegetarian) {
    vegetarian.addEventListener('change', () => {
      const allergensToAdd = ['fish', 'shellfish', 'meat', 'beef', 'pork', 'gelatin', 'chicken', 'turkey', 'duck', 'goose', 'lamb', 'mutton'];
      modifyCustomAllergens(vegetarian, allergensToAdd, allergensToAdd);
    });
  }

  if (glutenFree) {
    glutenFree.addEventListener('change', () => {
      const allergensToAdd = ['wheat', 'wheat flour', 'wheat germ', 'wheat starch', 'whole wheat bread'];
      modifyCustomAllergens(glutenFree, allergensToAdd, allergensToAdd);
    });
  }

  if (kosher) {
    kosher.addEventListener('change', () => {
      const allergensToAdd = ['fish', 'shellfish', 'shellfish', 'shrimp', 'lobster', 'crab', 'clams', 'mussels', 'oysters', 'pork', 'eel', 'shark', 'catfish'];
      modifyCustomAllergens(kosher, allergensToAdd, allergensToAdd);
    });
  }

  if (diabetic) {
    diabetic.addEventListener('change', () => {
      const allergensToAdd = ['high fructose', 'syrup', 'fructose', 'cake', 'sugar'];
      modifyCustomAllergens(diabetic, allergensToAdd, allergensToAdd);
    });
  }

  // Add allergen button click handler
  if (addAllergenButton) {
    addAllergenButton.addEventListener('click', () => {
      const customAllergen = document.getElementById('customAllergen').value.trim();
      if (customAllergen) {
        chrome.storage.local.get(['customAllergens'], (result) => {
          const customAllergens = result.customAllergens || [];
          customAllergens.push(customAllergen);
          chrome.storage.local.set({ customAllergens: customAllergens }, () => {
            updateCustomAllergenList();
            document.getElementById('customAllergen').value = '';
          });
        });
      }
    });
  }

  // Check page button click handler
  if (checkPageButton) {
    checkPageButton.addEventListener('click', () => {
      const selectedAllergens = [];
      document.querySelectorAll('input[name="allergen"]:checked').forEach((checkbox) => {
        selectedAllergens.push(checkbox.value);
      });

      chrome.storage.local.set({ allergens: selectedAllergens }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['content.js']
          });
        });
      });
    });
  }

  // Initialize the custom allergen list on popup load
  updateCustomAllergenList();
});
