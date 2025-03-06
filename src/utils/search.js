/**
 * 
 * @param {Array} array 
 * @param {String} text 
 * @param {[{fieldName:String,weight:Number}]} rules
 * @returns "fg"
 */
export function SearchMatchScore(array, text, rules) {
  // Early return if no text is provided, reset scores to undefined
  if (text.length === 0) {
    return array.map(item => {
      item.score = undefined;
      return item;
    });
  }

  const lowerText = text.toLowerCase();

  // Iterate over each item in the array
  for (let item of array) {
    let totalScore = 0; // Track the total score for the item

    // Apply each rule to the item
    for (let rule of rules) {
      const fieldValue = item[rule.fieldName];
      if (!fieldValue) continue;
      if (fieldValue === text) {
        totalScore += 100000;
        break;
      }

      const lowerFieldValue = fieldValue.toString().toLowerCase();
      const exactMatch = fieldValue.toString().indexOf(text) !== -1; // Case-sensitive match
      const caseInsensitiveIndex = lowerFieldValue.indexOf(lowerText); // Case-insensitive match

      // Apply score for case-sensitive match
      if (exactMatch) {
        totalScore += 5 * rule.weight;
      }

      // Apply score for case-insensitive match
      if (caseInsensitiveIndex !== -1) {
        totalScore += rule.weight;

        // Add score based on the position of the matched text
        const positionPoint = Math.max(0, 20 - caseInsensitiveIndex * 1.5);
        totalScore += positionPoint * rule.weight;

        // Bonus for exact length match
        if (lowerFieldValue.length === lowerText.length) {
          totalScore += 100;
        } else {
          // Add score based on remaining text length
          const remainingPoint = Math.max(0, 20 - (lowerFieldValue.length - lowerText.length));
          totalScore += remainingPoint * rule.weight;
        }
      }
    }

    // Update the item's score
    item.score = totalScore;
  }

  // Sort the array by score in descending order
  array.sort((a, b) => (b.score || 0) - (a.score || 0));

  return array;
}
