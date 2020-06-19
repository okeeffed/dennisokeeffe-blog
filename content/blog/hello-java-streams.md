# Hello Java Streams

Streams in Java 8 are a way of creating operations to express sophisticated data processesing queries.

This example will just give a short on how to stream to very basic lists:

1. Sorting an integer list.
2. Filter and uppercase a string list and return it as a filtered list.

## Setting up the JUnit tests

We will use two simple JUnit tests to ensure we get what we want.

```java
// test/java/HelloStreamsTest.java
import org.junit.Test;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class HelloStreamsTest {
    @Test
    public void testBasicStream() {
        List<Integer> input = Arrays.asList(1, 2, 3);

        Integer output = 6;
        assertEquals(output, new HelloStreams().sum(input));
    }

    @Test
    public void testFilteredStream() {
        List<String> input = Arrays.asList("a2", "a3", "b1", "c2", "a1");
        List<String> output = Arrays.asList("A2", "A3", "A1");

        assertEquals(output, new HelloStreams().filterStream(input));
    }
}
```

In our first test, we are simply giving an `input` integer list that we want and asserting that the return value equates to the `output` value.

The same is true of the second test where we want to compare to string lists for our favoured result.

## build.gradle

We'll use a `build.gradle` setup to be able to run our tests:

```java
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

## HelloStreams class

We'll set up two methods of the class that themselves are short and functional.

The first function `sum` will take our integer list, sum it up and return the sum.

The second function `filterStream` will take a list of strings and also return a list of strings that will use a filter and map function chain to give us the result that we want.

```java
import java.util.List;
import java.util.stream.Collectors;

class HelloStreams {
    Integer sum(List<Integer> input) {
        return input.stream().mapToInt(Integer::intValue).sum();
    }

    List<String> filterStream(List<String> input) {
        return input.stream().filter(t -> t.startsWith("a")).map(String::toUpperCase).collect(Collectors.toList());
    }
}
```

`sum` simply turns the input list into a stream, converts the values to ints and returns the sum.

`filterStream` converts out input list into a stream, will filter for values that only contain "a", then uppercase those results and collect them and convert them back into a list using the `Collectors` stream utility.

## Testing

Simply run `gradle test` and if everything compiles successful you will see two ticks.
