function hasArg(str) {
  for (const arg of process.argv) {
    if (arg.trim() === str) {
      return true
    }
  }
  return false
}

module.exports = { hasArg }
