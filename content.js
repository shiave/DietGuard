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

  // Find the added sugar content ***
  if (allergens.includes("sugar")) {
    const keyword = "added sugars";
    let foundAddedSugar = pageContent.includes("added sugars");

    // Find the position of the keyword in the text
    const keywordIndex = pageContent.indexOf(keyword.toLowerCase());

    if (keywordIndex !== -1) {
      // Extract the substring starting from the position after the keyword
      const substringAfterKeyword = pageContent.substring(keywordIndex + keyword.length);

      // Find the first number in the substring
      const extractedNumber = parseInt(substringAfterKeyword.match(/\d+/)[0], 10); // Assuming the number format is simple

      if (!isNaN(extractedNumber) && extractedNumber >= 5) {
        alert('Added sugar found on this page: ' + extractedNumber + ' grams added sugar');
      }
    }
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
