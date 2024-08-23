const fnCallCount = {};
const ARGS_STR_MAX = 20;
export function measureTime(fn, fn_name) {
  fn_name = fn.name || fn_name;
  return function(...args) {
    function getPrompt(end) {
      let args_str = JSON.stringify(args);
      if(args_str.length > ARGS_STR_MAX) {
        args_str = args_str.substring(0, ARGS_STR_MAX) + "... ";
      }
      return `Function ${fn_name} took ${(end - start) / 1000} seconds. Total call count: ${fnCallCount[fn_name]}. Called with ${args_str}`;
    }
    const start = performance.now(); // Start time
    let result;
    if(!(fn_name in fnCallCount)){
      fnCallCount[fn_name] =  1;
    } else {
      fnCallCount[fn_name]++;
    }
    // Execute the function
    result = fn(...args);

    // If result is a promise, handle it asynchronously
    if (result instanceof Promise) {
      return result
        .then(res => {
          const end = performance.now();   // End time
          console.log(getPrompt(end));
          return res;
        })
        .catch(err => {
          console.error(`Function ${fn_name} threw an error:`, err);
          const end = performance.now();   // End time even if there's an error
          console.log(getPrompt(end));
          throw err;
        });
    } else {
      const end = performance.now();   // End time for synchronous functions
      console.log(getPrompt(end));
      return result;
    }
  };
}
