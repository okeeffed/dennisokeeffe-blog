---
title: Auxiliary And Space Complexity
date: "2019-06-14"
description: Looking at usage of the web "fetch" API. This example uses the node-fetch library for demonstration purposes.
---



## Space Complexity vs. Auxiliary Space

Auxiliary space refers to the temporary space required by an algorithm to be used. Think temporary arrays, pointers etc.

Space complexity on the other hand is a reference to the total space taken in an algorithm with respect to the input size. It is inclusive of the auxiliary space from about plus the space used by the input.

When comparing things such as sorting algorithms, it is better to reference Auxiliary Space. Why? Well in the case of space complexity, all of the sorting algorithms that that an array consist of O(n) space complexity given the input size. That being said, auxiliary space for `insertion` and `heap` sort use O(1) auxiliary space while `merge` sort using O(n) auxiliary space given the conditions required to create temporary subarrays.



## Memory Usage during runtime

Memory is used during the execution of an algorithm for a few reasons:

1. _Instruction space_: memory used to save compiled version of instructions
2. _Environmental stack_: The variables kept on the system stack during execution. Think about the effect of memory used during recursion.
3. _Data space_: Amount of space used by variables + constants.

When calculating space complexity, we usually only consider the `data space`.



## Calculation

```javascript
const a = 1
const b = 10
const c = 100
const sum = (a, b, c) => a + b + c

const d = sum(a, b, c)
```

In the above function `sum`, we can resolve the space complexity required by the memory requirement. Given that all arguments in the above example are integers and the return value is an integer of set size, we know this will be constant.

Given the `Number` type in JavaScript is 64-bit (8 bytes), we can resolve that the memory requirement for `a`, `b` and `c` is `(24)`. Therefore, the function `sum` has O(1) constant space complexity given that we know the constant requirement of 24 bytes of data space for this function.

Looking at an example in C that requires a dynamic amount of memory in an array:

```c
// n is the length of array a[]
int sum(int a[], int n)
{
	int x = 0;		// 4 bytes for x
	for(int i = 0; i < n; i++)	// 4 bytes for i
	{
	    x  = x + a[i];
	}
	return(x);
}
```

Firstly, we know that `int` types in `C` require 4 bytes of space. Here we note that `4*n` bytes of space is required for the array `a[]` of integers. The remaining variables `x`, `n`, `i` and the return value each require a constant 4 bytes each of memory give that they are integers.

This gives us a total memory requirement of `(4n + 12)`. This itself is O(n) linear space complexity since the memory requires linearly increases with input value `n`.

What is important to note with this example is that the auxiliary space required for the above `sum` function is actually O(1) constant given that the auxiliary variables are only `x` and `i` which totals a `(8)` memory requirement (constant).



## References

- [Space Complexity of Algorithms | Studytonight](https://www.studytonight.com/data-structures/space-complexity-of-algorithms)
- [What does ‘Space Complexity’ mean? - GeeksforGeeks](https://www.geeksforgeeks.org/g-fact-86/)
