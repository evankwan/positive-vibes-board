// a utility function to remove all items from an array
const clearArray = (array) => {
  while (array.length > 0) {
    array.pop();
  }

  return array
}

export default clearArray