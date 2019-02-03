exports.asyncForEach = async (arr, cb) => {
  for (let index = 0; index < arr.length; index++) {
    await cb(arr[index], index, arr);
  }
};
