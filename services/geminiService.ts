import { BucketData, QuizResponse } from "../types";

// Helper to generate unique number options including the correct answer
// Generates numbers close to the correct answer for realistic difficulty
const generateNumberOptions = (correct: number): string[] => {
  const opts = new Set<number>();
  opts.add(correct);
  
  let attempts = 0;
  // Try to generate numbers close to the answer (e.g., correct +/- 1 to 5)
  while(opts.size < 4 && attempts < 50) {
      attempts++;
      const offset = Math.floor(Math.random() * 5) + 1; 
      const sign = Math.random() > 0.5 ? 1 : -1;
      const val = correct + (offset * sign);
      
      if (val >= 0) { // Ensure no negative numbers for this age group
          opts.add(val);
      }
  }
  
  // Fallback if we couldn't find enough unique numbers close by (rare)
  while(opts.size < 4) {
      const randomVal = Math.floor(Math.random() * 20);
      if (randomVal >= 0) opts.add(randomVal);
  }

  // Convert to strings and shuffle
  return Array.from(opts).sort(() => Math.random() - 0.5).map(String);
};

export const generateQuizQuestion = async (buckets: BucketData[]): Promise<QuizResponse> => {
    // Simulate a short delay for UX consistency (so the loader is visible briefly)
    await new Promise(resolve => setTimeout(resolve, 600));

    const activeBuckets = buckets.filter(b => b.count > 0);
    // Sort active buckets by count (Ascending)
    activeBuckets.sort((a, b) => a.count - b.count);
    
    // Safety check: if empty
    if (activeBuckets.length === 0) {
        return {
            question: "Hvor mange ting har du sorteret?",
            options: ["0", "1", "5", "10"],
            correctAnswer: "0"
        };
    }

    const minBucket = activeBuckets[0];
    const maxBucket = activeBuckets[activeBuckets.length - 1];
    const totalCount = buckets.reduce((sum, b) => sum + b.count, 0);
    const difference = maxBucket.count - minBucket.count;
    
    // Determine possible question types
    // 0: Most (Flest)
    // 1: Total (I alt)
    // 2: Fewest (Færrest) - Only if there is a difference
    // 3: Difference (Forskel) - Only if there is a difference
    
    let possibleTypes = [0, 1];
    
    const hasVariance = minBucket.count !== maxBucket.count;
    
    if (activeBuckets.length > 1 && hasVariance) {
        possibleTypes.push(2, 3);
    }
    
    const type = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
    
    // Get all labels for text options to use as distractors
    const allLabels = buckets.map(b => b.label);

    switch (type) {
        case 2: // Fewest
            {
                // Correct answer is the label of the bucket with lowest count
                const wrongOptions = allLabels.filter(l => l !== minBucket.label);
                // Shuffle and pick 3 wrong answers
                const selectedWrong = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
                // Combine with right answer and shuffle
                const options = [...selectedWrong, minBucket.label].sort(() => 0.5 - Math.random());
                
                return {
                    question: "Hvilken ting er der færrest af?",
                    options: options,
                    correctAnswer: minBucket.label
                };
            }
            
        case 1: // Total
            return {
                question: "Hvor mange ting er der i alt?",
                options: generateNumberOptions(totalCount),
                correctAnswer: totalCount.toString()
            };
            
        case 3: // Difference
            return {
                question: `Hvad er forskellen på antallet af ${maxBucket.label} og ${minBucket.label}?`,
                options: generateNumberOptions(difference),
                correctAnswer: difference.toString()
            };
            
        case 0: // Most (Default)
        default:
             {
                const wrongOptions = allLabels.filter(l => l !== maxBucket.label);
                const selectedWrong = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
                const options = [...selectedWrong, maxBucket.label].sort(() => 0.5 - Math.random());
                
                return {
                    question: "Hvilken ting er der flest af?",
                    options: options,
                    correctAnswer: maxBucket.label
                };
            }
    }
};