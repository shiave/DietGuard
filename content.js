chrome.storage.local.get(['allergens', 'customAllergens'], (result) => {
  let allergens = (result.allergens || []).concat(result.customAllergens || []);
  let pageContent = document.body.innerText.toLowerCase();
  let foundAllergens = allergens.filter(allergen => pageContent.includes(allergen.toLowerCase()));

  if (foundAllergens.length > 0) {
      alert('Restrictions found on this page: ' + foundAllergens.join(', '));
      
      // Highlight the allergens on the page
      foundAllergens.forEach(allergen => {
          highlightAllergen(allergen);
      });
  } else {
      alert('No restrictions found on this page.');
  }
});

function highlightAllergen(allergen) {
  let regex = new RegExp(`\\b${allergen}\\b`, 'gi');
  document.body.innerHTML = document.body.innerHTML.replace(regex, match => `<span class="highlight">${match}</span>`);
}

// Inject the CSS for highlighting
const style = document.createElement('style');
style.textContent = `
  .highlight {
      background-color: yellow;
      color: red;
      font-weight: bold;
  }
`;
document.head.append(style);
