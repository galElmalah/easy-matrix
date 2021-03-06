const addRows = addRowsTo => (matrix, onTop) => {
  for(let row of matrix) {
    onTop ? addRowsTo.unshift(row) : addRowsTo.push(row)
  }
}

const addColumns = addColumnsTo => (matrix, fromTheLeft) => {
  let index = 0;
  for(let row of matrix) {
    const mergedRow = fromTheLeft ? [...row,...addColumnsTo[index]] : [...addColumnsTo[index], ...row]
    addColumnsTo[index] = mergedRow;
    index++
  }
}
const assertEqualColumns = (firstMat, secondMat) => {
  if(firstMat.columnsSize !== secondMat.columnsSize) {
    throw new RangeError('cannot merge from top or bottom matrices that don\'t have the same number of columns.')
  }
}
  
const assertEqualRows = (firstMat, secondMat) => {
  if(firstMat.rowsSize !== secondMat.rowsSize) {
      throw new RangeError('cannot merge from right or left matrices that don\'t have the same number of rows.')
  }
}

const throwOnIllegalMergeCombos = (mergedFromDirections, oppositeMerge) => {
  if(mergedFromDirections.has(oppositeMerge)) {
    throw new Error('cannot merge vertical after an horizontal or the opposite merge has been done.\nthis usually mean you had an illegal combo in your directions argument.')
  }
}

function mergeMatrices(firstMat, secondMat, directions) {
  const mat = [];
  const mergedFromDirections = new Map();
  const rowAdder = addRows(mat);
  const columnAdder = addColumns(mat);
  rowAdder(firstMat);

  const top = () => {
    throwOnIllegalMergeCombos(mergedFromDirections, 'horizontal');
    mergedFromDirections.set('vertical', true);
    assertEqualColumns(firstMat, secondMat);
    rowAdder(secondMat, true);
  }

  const bottom = () => {
    throwOnIllegalMergeCombos(mergedFromDirections, 'horizontal');
    mergedFromDirections.set('vertical', true);    
    assertEqualColumns(firstMat, secondMat);
    rowAdder(secondMat);
  }

  const left = () => {
    throwOnIllegalMergeCombos(mergedFromDirections, 'vertical');
    mergedFromDirections.set('horizontal', true);    
    assertEqualRows(firstMat, secondMat)
    columnAdder(secondMat, true);
  }

  const right = () => {
    throwOnIllegalMergeCombos(mergedFromDirections, 'vertical');
    mergedFromDirections.set('horizontal', true);    
    assertEqualRows(firstMat, secondMat)
    columnAdder(secondMat);
  }
  const mergers = {
    top,
    bottom, 
    left,
    right
  }

  directions.forEach(mergeDirection => {
    mergers[mergeDirection]()
  });
  
  return mat
}

module.exports.mergeMatrices = mergeMatrices
