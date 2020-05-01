const arr = [1,2,"3",4,"5",6,7,"8",9];
console.log("Before: ", arr);

let after = arr.map(function(value, index,arr) {
    return parseInt(value);
});

let after1 = arr.map(x => parseInt(x) * parseInt(x));

console.log("After: ", after);
console.log("After1: ", after1);
