document.addEventListener('DOMContentLoaded', () => {
  const addAllergenButton = document.getElementById('addAllergen');
  const checkPageButton = document.getElementById('checkPage');
  //new conditions that do automatically add allergies for the user
  const vegan = document.getElementById('Vegan'); // New line
  const vegetarian = document.getElementById('Vegetarian'); // New line
  const glutenFree = document.getElementById('Gluten-Free'); // New line
  const diabetic = document.getElementById('Diabetic');



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

  //Vegan checked
  if (vegan) {
    vegan.addEventListener('change', () => {
      // Check if vegan checkbox is checked
      if (vegan.checked) {
        // Modify customAllergens to include eggs and milk
        chrome.storage.local.get(['customAllergens'], (result) => {
          let customAllergens = result.customAllergens || [];
          // Check if eggs and milk are not already in customAllergens
          if (!customAllergens.includes('eggs')) {
            customAllergens.push('eggs');
          }
          if (!customAllergens.includes('milk')) {
            customAllergens.push('milk');
          }
          chrome.storage.local.set({ customAllergens: customAllergens }, () => {
            console.log('Added eggs and milk to custom allergens.'); // Debug log
            updateCustomAllergenList();
          });
        });
      }
    });
  }

  //Vegetarian checked
  if (vegetarian) {
    vegetarian.addEventListener('change', () => {
      // Check if vegan checkbox is checked
      if (vegetarian.checked) {
        // Modify customAllergens to include eggs and milk
        chrome.storage.local.get(['customAllergens'], (result) => {
          let customAllergens = result.customAllergens || [];
          // Check if eggs and milk are not already in customAllergens
          if (!customAllergens.includes('fish')) {
            customAllergens.push('fish');
          }
          if (!customAllergens.includes('shellfish')) {
            customAllergens.push('shellfish');
          }
          const vegetarin_keywords = ['meat','beef','pork','gelatin', 'chicken','turkey','duck','goose','lamb','mutton'];
          vegetarin_keywords.forEach(item => {
            if (!customAllergens.includes(item)) {
              customAllergens.push(item);
            }
          });
          
          chrome.storage.local.set({ customAllergens: customAllergens }, () => {
            console.log('Added vegetarian to custom allergens.'); // Debug log
            updateCustomAllergenList();
          });
        });
      }
    });
  }

  //gluten free Checked
  if (glutenFree) {
    glutenFree.addEventListener('change', () => {
      // Check if vegan checkbox is checked
      if (kosher.checked) {
        // Modify customAllergens to include eggs and milk
        chrome.storage.local.get(['customAllergens'], (result) => {
          let customAllergens = result.customAllergens || [];
          // Check if eggs and milk are not already in customAllergens
          if (!customAllergens.includes('wheat')) {
            customAllergens.push('wheat');
          }
          const gf_keywords = ['wheat flour', 'wheat germ', 'wheat starch','wheat'];
          gf_keywords.forEach(item => {
            if (!customAllergens.includes(item)) {
              customAllergens.push(item);
            }
          });
          
          chrome.storage.local.set({ customAllergens: customAllergens }, () => {
            console.log('Added gluten free to custom allergens.'); // Debug log
            updateCustomAllergenList();
          });
        });
      }
    });
  }

    //Kosher Checked
    if (kosher) {
      kosher.addEventListener('change', () => {
        // Check if vegan checkbox is checked
        if (kosher.checked) {
          // Modify customAllergens to include eggs and milk
          chrome.storage.local.get(['customAllergens'], (result) => {
            let customAllergens = result.customAllergens || [];
            // Check if eggs and milk are not already in customAllergens
            if (!customAllergens.includes('fish')) {
              customAllergens.push('fish');
            }
            if (!customAllergens.includes('shellfish')) {
              customAllergens.push('shellfish');
            }
            const kosher_keywords = ['shellfish', 'shrimp', 'lobster', 'crab', 'clams', 'mussels', 'oysters','pork','eel','shark','catfish'];
            _keywords.forEach(item => {
              if (!customAllergens.includes(item)) {
                customAllergens.push(item);
              }
            });
            
            chrome.storage.local.set({ customAllergens: customAllergens }, () => {
              console.log('Added kosher to custom allergens.'); // Debug log
              updateCustomAllergenList();
            });
          });
        }
      });
    }


  //If Diabetic is checked
  if (diabetic) {
    diabetic.addEventListener('change', () => {
      // Check if vegan checkbox is checked
      if (diabetic.checked) {
        // Modify customAllergens to include eggs and milk
        chrome.storage.local.get(['customAllergens'], (result) => {
          let customAllergens = result.customAllergens || [];
          const diabetic_keywords = ['high fructose','syrup','fructose','cake','sugar'];
          _keywords.forEach(item => {
            if (!customAllergens.includes(item)) {
              customAllergens.push(item);
            }
          });

          chrome.storage.local.set({ customAllergens: customAllergens }, () => {
            console.log('Added eggs and milk to custom allergens.'); // Debug log
            updateCustomAllergenList();
          });
        });
      }
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
