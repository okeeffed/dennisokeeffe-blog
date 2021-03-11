---
title: Rust Fizzbuzz
date: "2019-04-13"
description: The classic FizzBuzz implementation in Rust with Unit Testing.
---

A basic implementation of FizzBuzz in Rust.



## Writing the Code

Execute the tests with:

```bash
$ cargo test
```

All but the first test have been ignored. After you get the first test to
pass, open the tests source file which is located in the `tests` directory
and remove the `#[ignore]` flag from the next test and get the tests to pass
again. Each separate test is a function with `#[test]` flag above it.
Continue, until you pass every test.

If you wish to run all tests without editing the tests source file, use:

```bash
$ cargo test -- --ignored
```

To run a specific test, for example `some_test`, you can use:

```bash
$ cargo test some_test
```

If the specific test is ignored use:

```bash
$ cargo test some_test -- --ignored
```

To learn more about Rust tests refer to the [online test documentation][rust-tests]

Make sure to read the [Modules](https://doc.rust-lang.org/book/ch07-02-modules-and-use-to-control-scope-and-privacy.html) chapter if you
haven't already, it will help you with organizing your files.



## Further improvements

After you have solved the exercise, please consider using the additional utilities, described in the [installation guide](https://exercism.io/tracks/rust/installation), to further refine your final solution.

To format your solution, inside the solution directory use

```bash
cargo fmt
```



## Cargo.toml

Setup your `Cargo.toml` file to look like the following:

```toml
[package]
edition = "2019"
name = "fizz_buzz"
version = "0.1.0"

[[test]]
name = "fizz_buzz"
path = "tests/fizz_buzz.rs"

[dependencies]
# itoa = "0.4.3"
```



## The test file

In `tests/fizz_buzz.rs`:

```rust
extern crate fizz_buzz;


#[test]
fn test_returns_string() {
    assert_eq!("2", fizz_buzz::run(2));
}

#[test]
fn test_fizz() {
    assert_eq!("Fizz", fizz_buzz::run(3));
}

#[test]
fn test_buzz() {
    assert_eq!("Buzz", fizz_buzz::run(5));
}

#[test]
fn test_fizz_buzz() {
    assert_eq!("FizzBuzz", fizz_buzz::run(15));
}
```



## FizzBuzz

Create `src/libs.rs`:

```rust
pub fn run(i: u32) -> String {
    if i % 15 == 0 {
        "FizzBuzz".to_string()
    } else if i % 5 == 0 {
        "Buzz".to_string()
    } else if i % 3 == 0 {
        "Fizz".to_string()
    } else {
        i.to_string()
    }
}
```



## Run the final test

`cargo test`
