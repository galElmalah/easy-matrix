function defaultMapper(i,j) {
  return 1
}

class Matrix {
  constructor(n, m, options = {}){
    this.rowsSize = n;
    this.columnsSize = m;
    this.options = options;
    this._matrix = []
    return this;
  }

  get size() {
    return [this.rowsSize, this.columnsSize]
  }

  get matrix() {
    if(this._matrix.length) {
      return this._matrix;
    }
    return this.build()
  }

  build() {
    const mapper = this.options.mapper || defaultMapper
    for(let i=0; i < this.rowsSize ; i++) {
      let column = [];
      for(let j=0; j < this.columnsSize ; j++) {
        column[j] = mapper(i,j)
      }
      this._matrix [i] = column;
    }
    return this._matrix ;
  }

  hasTheSameSize(matrixTwo) {
    return this.size[0] === matrixTwo.size[0] && this.size[1] === matrixTwo.size[1]
  }

  column(i) {
    if(i<0 || i > this.columnsSize-1) {
      throw new RangeError('Illegal indexes')
    }
    let column = [];
    for(const row of this) {
      column.push(row[i])
    }
    return column
  }

  row(i) {
    if(i<0 || i > this.rowsSize - 1) {
      throw new RangeError('Illegal indexes')
    }
    return [...this.matrix[i]]
  }

  cell(i,j) {
    if(i < 0 || i > this.rowsSize -1|| j<0 || j > this.columnsSize-1) {
      throw new RangeError('Illegal indexes')
    }
    return this.matrix[i][j]
  }

  [Symbol.iterator](){
    let index = 0;
    return {
      next: () => ({
        value:  this.matrix[index++],
        done: index > this.rowsSize
      })
    }
  }


  plus(matrixTwo) {
    if(!this.hasTheSameSize(matrixTwo)) {
      throw new Error(`Mismatch matrix sizes.\ncannot add two matrixes of sizes: mat1 -> ${this.size} :::: mat2 -> ${matrixTwo.size}  `)
    }
    const [n,m] = this.size;
    const mapper = (i,j) => this.cell(i,j) + matrixTwo.cell(i,j)
    return new Matrix(n,m, {mapper})
  }

  minus(matrixTwo) {
    if(!this.hasTheSameSize(matrixTwo)) {
      throw new Error(`Mismatch matrix sizes.\ncannot subtract two matrixes of sizes: mat1 -> ${this.size} :::: mat2 -> ${matrixTwo.size}  `)
    }
    const [n,m] = this.size;
    const mapper = (i,j) => this.cell(i,j) - matrixTwo.cell(i,j)
    return new Matrix(n,m, {mapper})
  }

  map(fn) {
    const [n,m] = this.size;
    const mapper = (i,j) => fn(this.cell(i,j), [i,j], this.matrix)
    return new Matrix(n,m, {mapper})
  }

  forEach(fn) {
    for(let i=0; i < this.rowsSize ; i++) {
      for(let j=0; j < this.columnsSize ; j++) {
        fn(this.cell(i,j), [i,j], this.matrix)
      }
    }
  }

  transpose() {
    const [n,m] = this.size;
    const mapper = (i,j) => this.cell(j,i)
    return new Matrix(m,n, {mapper})
  }

  _matrixMultiplication(by) {
    if(this.columnsSize !== by.rowsSize) {
      throw new RangeError("Cannot multiply matrixes if the row and col sizes are not equal")
    }

    const mapper = (i,j) => {
      const row = this.row(i);
      const column = by.column(j)
      const cell = row.reduce((acc,next,i) => acc + next*column[i],0)
      return cell;
    }

    return new Matrix(this.rowsSize,by.columnsSize, {mapper})
  }

  multiply(by) {

    if(typeof by === 'number') {
      const [n,m] = this.size;
      return new Matrix(n,m, {mapper: (i,j) => this.cell(i,j)*by})
    }

    if( by instanceof Matrix) {
      return this._matrixMultiplication(by)
    }

    throw new TypeError('Cannot multiply with a value that inst a "number" or another Matrix')
   
  }

  toString() {
    let rows = []
    for(let i=0; i < this.rowsSize ; i++) {
      let row = '| '
      for(let j=0; j < this.columnsSize ; j++) {
        row+= this.cell(i,j) + ' ';
      }
      row+=' |'
      rows.push(row)
    }
    console.log(rows.join('\n'))
  }

}


module.exports.Matrix = Matrix;