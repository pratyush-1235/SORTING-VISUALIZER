const MIN_VALUE = 5;
const MAX_VALUE = 100;
const INITIAL_ARRAY_SIZE = 50;
const INITIAL_ANIMATION_SPEED_MS = 50;

let array = [];
let sorting = false;
let algorithm = 'bubble';
let speed = INITIAL_ANIMATION_SPEED_MS;
let arraySize = INITIAL_ARRAY_SIZE;
let stepMode = false;
let metrics = { comparisons: 0, swaps: 0 };

const arrayContainer = document.getElementById('arrayContainer');
const comparisonsCount = document.getElementById('comparisonsCount');
const swapsCount = document.getElementById('swapsCount');
const generateArrayBtn = document.getElementById('generateArrayBtn');
const startSortingBtn = document.getElementById('startSortingBtn');
const algorithmSelect = document.getElementById('algorithmSelect');
const speedRange = document.getElementById('speedRange');
const arraySizeRange = document.getElementById('arraySizeRange');
const stepModeSwitch = document.getElementById('stepModeSwitch');

// Generate a random array
function generateRandomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE);
}

// Reset array
function resetArray() {
  array = generateRandomArray(arraySize);
  metrics = { comparisons: 0, swaps: 0 };
  comparisonsCount.textContent = metrics.comparisons;
  swapsCount.textContent = metrics.swaps;
  renderArray(array);
}

// Render the array
function renderArray(arr, highlightIndices = []) {
  arrayContainer.innerHTML = '';
  arr.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.classList.add('array-bar');
    bar.style.height = `${value}%`;
    if (highlightIndices.includes(index)) {
      bar.classList.add('highlight');
    }
    arrayContainer.appendChild(bar);
  });
}

// Sorting algorithms
async function bubbleSort() {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (compare(array[j], array[j + 1]) > 0) {
        swap(j, j + 1);
        await updateArray([j, j + 1]);
      }
    }
  }
}

async function selectionSort() {
  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < array.length; j++) {
      if (compare(array[j], array[minIdx]) < 0) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      swap(i, minIdx);
      await updateArray([i, minIdx]);
    }
  }
}

// Compare function
function compare(a, b) {
  metrics.comparisons++;
  comparisonsCount.textContent = metrics.comparisons;
  return a - b;
}

// Swap function
function swap(i, j) {
  [array[i], array[j]] = [array[j], array[i]];
  metrics.swaps++;
  swapsCount.textContent = metrics.swaps;
}

// Update the array in the UI
async function updateArray(highlightIndices = []) {
  renderArray(array, highlightIndices);
  if (stepMode) {
    return new Promise((resolve) => {
      const nextStepButton = document.createElement('button');
      nextStepButton.textContent = 'Next Step';
      nextStepButton.onclick = () => {
        nextStepButton.remove();
        resolve();
      };
      document.body.appendChild(nextStepButton);
    });
  } else {
    return new Promise(resolve => setTimeout(resolve, speed));
  }
}

// Event listeners
generateArrayBtn.addEventListener('click', resetArray);
startSortingBtn.addEventListener('click', async () => {
  if (sorting) return;
  sorting = true;
  switch (algorithm) {
    case 'bubble':
      await bubbleSort();
      break;
    case 'selection':
      await selectionSort();
      break;
  }
  sorting = false;
});

algorithmSelect.addEventListener('change', (e) => {
  algorithm = e.target.value;
});

speedRange.addEventListener('input', (e) => {
  speed = parseInt(e.target.value);
});

arraySizeRange.addEventListener('input', (e) => {
  arraySize = parseInt(e.target.value);
  resetArray();
});

stepModeSwitch.addEventListener('change', (e) => {
  stepMode = e.target.checked;
});

// Initialize
resetArray();
