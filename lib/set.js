// @ts-ignore
class set extends Array {
    constructor(arr) {
        const newArr = [];
        arr.forEach(item => !newArr.includes(item) && newArr.push(item));
        super(...newArr);
    }
}
if (!Set) {
    // @ts-ignore
    Set = set;
}
console.log(new Set([123, 1, 1, 2, 3, 4, 4, 4, 4, 4213]));
