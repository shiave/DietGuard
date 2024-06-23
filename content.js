chrome.storage.local.get(['allergens', 'customAllergens'], (result) => {
  if (chrome.runtime.lastError) {
    console.error('Error retrieving allergens from storage:', chrome.runtime.lastError);
    return;
  }

  let allergens = (result.allergens || []).concat(result.customAllergens || []);
  console.log(allergens);

  let pageContent = document.body.innerText.toLowerCase();

  // Convert allergens to lowercase for case-insensitive comparison
  let foundRestrictions = allergens.filter(allergen => pageContent.includes(allergen.toLowerCase()));

  // Find the added sugar content ***
  if (allergens.includes("sugar")){
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

  // ***

  if (foundRestrictions.length > 0) {
    alert('Restrictions found on this page: ' + foundRestrictions.join(', '));
  } else {
    alert('No restrictions found on this page.');
  }
});