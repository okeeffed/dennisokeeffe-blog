# FizzBuzz in PHP

This expects an installation on the system of `phpunit`.

## Test File

Create `fizz-buzz_test.php`:

```php
<?php

require "fizz-buzz.php";

class FizzBuzzTest extends PHPUnit\Framework\TestCase
{
    public function testFizz()
    {
        $this->assertEquals('Fizz', fizzBuzz(3));
    }

    public function testBuzz()
    {
        $this->assertEquals('Buzz', fizzBuzz(5));
    }

    public function testFizzBuzz()
    {
        $this->assertEquals('FizzBuzz', fizzBuzz(15));
    }

    public function testReturnsInt()
    {
        $this->assertEquals(2, fizzBuzz(2));
    }
}
```

## FizzBuzz

Create `fizz-buzz.php`:

```php
<?php

function fizzBuzz($i)
{
    switch(true) {
        case ($i % 3 == 0 && $i % 5 == 0):
            return "FizzBuzz";
        case ($i % 3 == 0):
            return "Fizz";
        case ($i % 5 == 0):
            return "Buzz";
        default:
            return $i;
    }
}
```

## Running Tests

Change into directory and run `phpunit.phar file_test.php`.
