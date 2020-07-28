---
title: Unix Redirection In C
description: Explore how redirection works in C
date: "2020-07-28"
tags: C, tutorial, unix
---

This short post is a recount of an exploration into redirection in the C language.

As always, let's go to our friend [Wikipedia](<https://en.wikipedia.org/wiki/Redirection_(computing)#:~:text=In%20computing%2C%20redirection%20is%20a,streams%20to%20user%2Dspecified%20locations.>) to set the definition for us:

> In computing, redirection is a form of interprocess communication, and is a function common to most command-line interpreters, including the various Unix shells that can redirect standard streams to user-specified locations.
>
> In Unix-like operating systems, programs do redirection with the dup2(2) system call, or its less-flexible but higher-level stdio analogues, freopen(3) and popen(3).

Basic redirection can use `<` to redirect input and `>` to redirect output.

For example, we can use the redirect output operator to redirect the output from `echo "Hello!"` into a file `example.txt`.

```s
> echo "Hello!" > example.txt
> cat example.txt
Hello!
```

As mentioned by our pal Wikipedia, we can use the `dup2` system call in C to manage a similar thing!

## A simple example

In our first example, we are going to write a simple example of two variables that open a `foobar.txt` that iterates character by character.

```s
touch foobar.txt one.c
```

Inside of `foobar.txt`, add th following:

```txt
foobar test
```

As for the contents of `one.c`:

```c
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>

int main() {
  int fd1, fd2;
  char c;

  fd1 = open("foobar.txt", O_RDONLY);
  fd2 = open("foobar.txt", O_RDONLY);
  // c becomes f
  read(fd2, &c, 1);
  // c becomes o
  read(fd2, &c, 1);
  // c becomes o
  read(fd2, &c, 1);
  // c becomes b
  read(fd2, &c, 1);
  printf("c = %c\n", c); // c = b

  // now reading in fd1, so c becomes f again
  read(fd1, &c, 1);
  printf("c = %c\n", c); // c = f

  // redirect and now fd2 is now back at f
  dup2(fd1, fd2);
  // reading back fd2 which has been redirected,
  // so c actually becomes o!
  read(fd2, &c, 1);
  printf("c = %c\n", c); // c = 0
  exit(0);
}
```

The comments in the code explain what is happening in order, but we're just going to print out the result by running `gcc one.c && ./a.out`. The output binary `a.out` is the name given since we do not provide output to GCC.

```s
> gcc one.c && ./a.out
c = b
c = f
c = o
```

To explain further what is going on:

1. We assign `fd1` and `fd2` to open `foobar.txt`.
2. We use `read` to read in a character and assign it to variable `c`.
3. Each time we read `fd2`, we move one character further along in the text file.
4. Eventually, we read `fd1` once and then we redirect`fd1` to `fd2`.
5. We read `fd2` one last time, but after redirection the value now reads "o".

## A more readable example

The above can seem hard to comprehend - it is better playing around with this stuff in C. This example, I decided to use `scanf` to read in from stdin in the second example, because I feel like the example was a little clearer for me.

> Note: Given I knew the length of the words in the file, I just set a max STR_LEN of 6 as opposed to some dynamic calculation.

Create a file `two.c`.

```c
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>

#define STR_LEN 6

int main() {
  int fd1;
  char *c1 = (char*)malloc(STR_LEN);
  char *c2 = (char*)malloc(STR_LEN);
  // notice no values
  printf("c1 = %s\nc2 = %s\n", c1, c2);

  fd1 = open("foobar.txt", O_RDONLY);
  // redirect fd1 to stdin
  if (dup2(fd1, STDIN_FILENO) < 0) {
    printf("Unable to duplicate file descriptor.");
    exit(EXIT_FAILURE);
  }

  // scan c1 and c2 in from stdin
  scanf("%s %s", c1, c2);
  // values now becomes "foobar" and "test" respectively
  printf("c1 = %s\nc2 = %s\n", c1, c2);

  // SAVE THE WHALES, FREE THE MALLOCS
  free(c1);
  free(c2);

  exit(0);
}
```

Now if we run `gcc two.c && ./a.out`, we get the following:

```s
> gcc two.c && ./a.out
c1 =
c2 =
c1 = foobar
c2 = test
```

In this case, we do the following:

1. Allocate memory for `c1` and `c2`.
2. Confirm no values in first print.
3. Read in the `foobar.txt` file to file descriptor `fd1`.
4. Redirect `fd1` to `stdin`.
5. Use `scanf` to assign the values to `c1` and `c2` from `stdin`.
6. Confirm with the last print that `c1` and `c2` have been assigned the words "foobar" and "test" respectively!

Hooray! Redirection to stdin is a success (and no segmentation faults).

I will likely redo this exercise in Rust and Golang this week to show the how-to.

## Resources

1. [Computer Systems A Programmer's Perspective - Page 944](https://www.amazon.com.au/Computer-Systems-Programmers-Perspective-Global/dp/1292101768/)
2. [dup2 System Call](https://linuxhint.com/dup2_system_call_c/)
3. [Stack Overflow - difference between read and fread](<https://stackoverflow.com/questions/584142/what-is-the-difference-between-read-and-fread#:~:text=read()%20is%20a%20low,order%20to%20fill%20its%20buffer.>)
4. [Unix System Calls - read](https://www.tutorialspoint.com/unix_system_calls/read.htm)
5. [Top 20 C Pointer Mistakes](https://www.acodersjourney.com/top-20-c-pointer-mistakes/)
6. [Stack Overflow - Reading file and getting string length](https://stackoverflow.com/questions/3377659/reading-in-a-file-and-getting-the-string-length)
7. [CS 702 Operating Systems - redirect and pipes](http://www.cs.loyola.edu/~jglenn/702/S2005/Examples/dup2.html)
8. [TutorialsPoint - Redirection](https://www.tutorialspoint.com/unix/unix-io-redirections.htm)
9. [Redirection - Wikipedia](<https://en.wikipedia.org/wiki/Redirection_(computing)#:~:text=In%20computing%2C%20redirection%20is%20a,streams%20to%20user%2Dspecified%20locations.>)

_Image credit: [Michael Kubler](https://unsplash.com/@kublermdk)_