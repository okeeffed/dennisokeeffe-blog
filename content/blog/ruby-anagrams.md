---
title: Ruby Anagrams
date: "2018-08-07"
description: Ruby implementation of comparing two strings to check if they are anagrams.
---

# Ruby Anagrams

This requires the gem installation of `minitest`.

## Test file

Create file `anagrams_test.rb`:

```ruby
begin
  gem 'minitest', '>= 5.0.0'
  require 'minitest/autorun'
  require_relative 'anagrams'
rescue Gem::LoadError => e
  puts "\nMissing Dependency:\n#{e.backtrace.first} #{e.message}"
  puts 'Minitest 5.0 gem must be installed for the Ruby track.'
rescue LoadError => e
  puts "\nError:\n#{e.backtrace.first} #{e.message}"
  puts DATA.read
  exit 1
end

# Common test data version: 1.1.0 be3ae66
class AnagramsTest < Minitest::Test
  def test_simple_anagram
    a = "tokyo"
    b = "kyoto"
    # skip
    assert_equal true, Anagrams.compare(a,b)
  end

  def test_simple_capitals_anagram
    c = "tokyo"
    d = "Kyoto"
    # skip
    assert_equal true, Anagrams.compare(c,d)
  end

  def test_punctuation_anagram
    e = "t 3 55oky!o"
    f = "Ky@ ot%o"
    # skip
    assert_equal true, Anagrams.compare(e,f)
  end
end

__END__
```

## Anagrams

Create file `anagrams.rb`:

```ruby
class Anagrams
    def self.compare(a, b)
        return a.gsub(/[^a-z]/i, "").downcase.chars.sort.join == b.gsub(/[^a-z]/i, "").downcase.chars.sort.join
    end
end
```

## Testing

Change into directory and run `ruby anagrams_test.rb`.
