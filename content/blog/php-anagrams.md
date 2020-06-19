---
title: PHP Anagrams
date: "2019-08-02"
description: PHP implementation of comparing two strings to check if they are anagrams.
---

# Anagrams in PHP

This expects an installation on the system of `phpunit`.

## Test File

Create `anagrams_test.php`:

```php
<?php

require "anagrams.php";

class AnagramsTest extends PHPUnit\Framework\TestCase
{
    public function testAnagramsBasic()
    {
        $a = "tokyo";
        $b = "kyoto";
        $this->assertEquals(true, anagrams($a,$b));
    }


    public function testAnagramsWithCapitals()
    {
        // $this->markTestSkipped('Skipped.');
        $a = "Tokyo";
        $b = "kyoto";
        $this->assertEquals(true, anagrams($a,$b));
    }

    public function testAnagramsWithPunctuation()
    {
        // $this->markTestSkipped('Skipped.');
        $a = "To  35k 2@4yo";
        $b = "kYoTo223!!";
        $this->assertEquals(true, anagrams($a,$b));
    }
}
```

## Anagrams

Create `anagrams.php`:

```php
<?php

function anagrams($a, $b)
{
    $regA = preg_replace("/[^a-z]/i", "", $a);
    $regB = preg_replace("/[^a-z]/i", "", $b);

    $regA = strtolower($regA);
    $splitA = str_split($regA);
    sort($splitA);

    $regB = strtolower($regB);
    $splitB = str_split($regB);
    sort($splitB);

    $resA = implode("", $splitA);
    $resB = implode("", $splitB);

    return $resA == $resB;
}
```

## Running Tests

Change into directory and run `phpunit.phar anagrams_test.php`.
