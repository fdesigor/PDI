const MatrixToArray = matrix => {
    let array = [];

    matrix.map(arr => {
        arr.map(num => {
            array.push(num);
        });
    });

    return array
}

export default MatrixToArray;