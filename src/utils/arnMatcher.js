// utils/arnMatcher.js

function matchArn(pattern, resource) {
  const patternParts = pattern.split(":");
  const resourceParts = resource.split(":");

  if (patternParts.length !== resourceParts.length) {
    return false;
  }

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i] === "*") {
      continue;
    }

    if (patternParts[i] !== resourceParts[i]) {
      return false;
    }
  }

  return true;
}

// regex verison - recommanded 
// function matchArn(pattern, resource) {
//   const regex = new RegExp(
//     "^" +
//       pattern
//         .replace(/\*/g, ".*")
//         .replace(/:/g, "\\:") +
//       "$"
//   );

//   return regex.test(resource);
// }

module.exports = {
  matchArn,
};