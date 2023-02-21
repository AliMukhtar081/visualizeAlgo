function estimateTimeComplexity(algorithm, inputSize) {
  // `algorithm` is a string containing the C++ code for the algorithm
  // `inputSize` is the size of the input the algorithm operates on

  // Identify all for and while loops
  const loopRegex = /for\s*\(([^;]*;[^;]*;[^)]*)\)|while\s*\(([^)]*)\)/g;
  const loopMatches = algorithm.matchAll(loopRegex);
  const loopCounts = [];

  // Count the iterations of each loop based on their loop conditions
  for (const match of loopMatches) {
    const [_, forLoop, whileLoop] = match;
    let count = null;
    
    if (forLoop) {
      const conditions = forLoop.split(';');
      const condition1 = conditions[0].trim();
      const condition2 = conditions[1].trim();
      const step = conditions[2].trim();

      if (/^[a-zA-Z0-9_]+\s*=/i.test(condition1)) {
        const varName = condition1.split('=')[0].trim();
        count = inputSize;
        for (let i = 0; i < inputSize; i++) {
          const value = i * step;
          if (eval(`${value} ${condition2}`)) {
            count = i + 1;
            break;
          }
        }
      }
    } else if (whileLoop) {
      count = inputSize;
      for (let i = 0; i < inputSize; i++) {
        if (!eval(whileLoop)) {
          count = i;
          break;
        }
      }
    }

    loopCounts.push(count);
  }

  // Estimate the time complexity based on the number of loops and their iterations
  let timeComplexity = 1;
  for (const count of loopCounts) {
    timeComplexity *= count || 1;
  }

  return timeComplexity;
}
