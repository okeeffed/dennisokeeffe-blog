---
title: Ruby Error Handling
date: "2018-10-25"
description: Examples on how to handle errors in Ruby.
---

This is a basic example of raising and exception and rescueing the thrown exception.

```ruby
def raise_and_rescue
  begin
    puts 'I am before the raise.'
    raise 'An error has occured.'
    puts 'I am after the raise.'
  rescue
    puts 'I am rescued.'
  end
  puts 'I am after the begin block.'
end
```
