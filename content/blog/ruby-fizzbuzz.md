---
title: Ruby Fizzbuzz
date: "2018-07-19"
description: The classic FizzBuzz implementation in Ruby with Unit Testing.
---

# Ruby FizzBuzz

This requires the gem installation of `minitest`.

## Test file

Create file `fizz_buzz_test.rb`:

```ruby
begin
  gem 'minitest', '>= 5.0.0'
  require 'minitest/autorun'
  require_relative 'fizz_buzz'
rescue Gem::LoadError => e
  puts "\nMissing Dependency:\n#{e.backtrace.first} #{e.message}"
  puts 'Minitest 5.0 gem must be installed for the Ruby track.'
rescue LoadError => e
  puts "\nError:\n#{e.backtrace.first} #{e.message}"
  puts DATA.read
  exit 1
end

# Common test data version: 1.1.0 be3ae66
class FizzBuzzTest < Minitest::Test
  def test_fizz
    # skip
    assert_equal "Fizz", FizzBuzz.run(3)
  end

  def test_buzz
    # skip
    assert_equal "Buzz", FizzBuzz.run(5)
  end

  def test_fizzbuzz
    # skip
    assert_equal "FizzBuzz", FizzBuzz.run(15)
  end

  def test_return_int
    # skip
    assert_equal 2, FizzBuzz.run(2)
  end
end

__END__
```

## FizzBuzz

Create file `fizz_buzz.rb`:

```ruby
class FizzBuzz
    def self.run(arg)
        case true
        when arg % 3 == 0 && arg % 5 == 0
            return "FizzBuzz"
        when arg % 3 == 0
            return "Fizz"
        when arg % 5 == 0
            return "Buzz"
        else
            return arg
        end
    end
end
```

## Testing

Change into directory and run `ruby fizz_buzz_test.rb`.
