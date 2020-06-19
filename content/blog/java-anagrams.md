---
title: Java Anagrams
date: "2018-10-22"
description: Solution in Java.
---

# Anagrams in Java

## Gradle setup

For our `build.gradle` file:

```gradle
apply plugin: "java"
apply plugin: "eclipse"
apply plugin: "idea"

repositories {
    mavenCentral()
}

dependencies {
    testCompile "junit:junit:4.12"
}
test {
    testLogging {
        exceptionFormat = 'full'
        events = ["passed", "failed", "skipped"]
    }
}
```

## Setting up the Tests

Create file `src/test/java/AnagramsTest.java`:

```java
import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class AnagramsTest {
    @Test
    public void testAnEmptyString() {
        assertEquals("", new Anagrams().hello(""));
    }

    @Ignore("Remove to run test")
    @Test
    public void testAWord() {
        assertEquals("False", new Anagrams().hello(""));
    }
}

```

## Anagrams

In `src/main/java/Anagrams.java`:

```java
// TO FINISH
```

## Running tests

Run `gradle test` to compile and test our Anagrams class.
