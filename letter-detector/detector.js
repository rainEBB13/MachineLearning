const synaptic = require('synaptic');
const { Architect, Trainer } = synaptic;

/**
 * Turn the # into 1s and . into 0s. for whole string
 * @param string
 * @returns {Array}
 */
function character(string) {
  return string
    .trim()
    .split('')
    .map(integer);
}

/**
 * Return 0 or 1 for '#'
 * @param character
 * @returns {number}
 */
function integer(character) {
  if ('#' === character) return 1;
  return 0;
}

const a = character(
  '.#####.' +
  '#.....#' +
  '#.....#' +
  '#######' +
  '#.....#' +
  '#.....#' +
  '#.....#'
);

const b = character(
  '######.' +
  '#.....#' +
  '#.....#' +
  '######.' +
  '#.....#' +
  '#.....#' +
  '######.'
);

const c = character(
  '#######' +
  '#......' +
  '#......' +
  '#......' +
  '#......' +
  '#......' +
  '#######'
);

console.log('Creating neural network...');
// Create a neural network with 49 inputs (7x7), 20 hidden neurons, and 3 outputs
const network = new Architect.Perceptron(49, 20, 3);

// Prepare training data
const trainingSet = [
  {
    input: a,
    output: [1, 0, 0]  // A
  },
  {
    input: b,
    output: [0, 1, 0]  // B
  },
  {
    input: c,
    output: [0, 0, 1]  // C
  }
];

console.log('Training network...');
const trainer = new Trainer(network);

// Train the network
const trainingResult = trainer.train(trainingSet, {
  rate: 0.3,
  iterations: 5000,
  error: 0.005,
  shuffle: true,
  log: 1000,
  cost: Trainer.cost.CROSS_ENTROPY
});

console.log('Training completed!');
console.log(`Final error: ${trainingResult.error.toFixed(6)}`);
console.log(`Iterations: ${trainingResult.iterations}`);

/**
 * Test with perfect patterns
 */
console.log('\n=== Testing with perfect patterns ===');
testLetter('A (perfect)', a);
testLetter('B (perfect)', b);
testLetter('C (perfect)', c);

/**
 * Test with modified patterns
 */
console.log('\n=== Testing with modified patterns ===');

// Predict the letter A, even with a pixel off
const modifiedA = character(
  '.#####.' +
  '#.....#' +
  '#.....#' +
  '###.###' +  // This line is different (pixel missing)
  '#.....#' +
  '#.....#' +
  '#.....#'
);
testLetter('A (modified)', modifiedA);

// Test with slightly different B
const modifiedB = character(
  '######.' +
  '#.....#' +
  '#.....#' +
  '######.' +
  '#.....#' +
  '#....##' +  // Extra pixel here
  '######.'
);
testLetter('B (modified)', modifiedB);

// Test with noisy C
const modifiedC = character(
  '#######' +
  '#......' +
  '#..#...' +  // Added noise
  '#......' +
  '#......' +
  '#......' +
  '#######'
);
testLetter('C (modified)', modifiedC);

/**
 * Helper function to test and display results
 */
function testLetter(description, input) {
  const result = network.activate(input);
  
  // Map results to letters
  const letters = ['A', 'B', 'C'];
  const predictions = result.map((confidence, index) => ({
    letter: letters[index],
    confidence: confidence
  })).sort((a, b) => b.confidence - a.confidence);
  
  const bestGuess = predictions[0];
  
  console.log(`\n${description}:`);
  console.log(`Best guess: ${bestGuess.letter} (${(bestGuess.confidence * 100).toFixed(1)}% confidence)`);
  
  // Show all predictions
  console.log('All predictions:');
  predictions.forEach(pred => {
    console.log(`  ${pred.letter}: ${(pred.confidence * 100).toFixed(1)}%`);
  });
  
  // Display the pattern
  console.log('Pattern:');
  displayPattern(input);
}

/**
 * Display the pattern in a readable 7x7 format
 */
function displayPattern(pattern) {
  for (let i = 0; i < 7; i++) {
    let row = '';
    for (let j = 0; j < 7; j++) {
      row += pattern[i * 7 + j] ? '#' : '.';
    }
    console.log(`  ${row}`);
  }
}

/**
 * Function to test your own custom patterns
 */
function testCustomPattern(patternString, description) {
  const pattern = character(patternString);
  testLetter(description, pattern);
}

// Example of testing a custom pattern
console.log('\n=== Testing custom pattern ===');
testCustomPattern(
  '.#####.' +
  '#....##' +  // Slightly different A
  '#.....#' +
  '#######' +
  '#.....#' +
  '#.....#' +
  '#.....#',
  'Custom A variant'
);