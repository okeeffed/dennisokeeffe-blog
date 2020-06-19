---
title: Ruby Binary Search Trees
date: "2019-04-01"
description: Ruby implementation of a Binary Search Tree.
---

# Ruby Binary Search Trees

This requires the gem installation of `minitest`.

## Test file

Create file `binary_search_trees_test.rb`:

```ruby
begin
  gem 'minitest', '>= 5.0.0'
  require 'minitest/autorun'
  require_relative 'binary_search_tree'
rescue Gem::LoadError => e
  puts "\nMissing Dependency:\n#{e.backtrace.first} #{e.message}"
  puts 'Minitest 5.0 gem must be installed for the Ruby track.'
rescue LoadError => e
  puts "\nError:\n#{e.backtrace.first} #{e.message}"
  puts DATA.read
  exit 1
end

# Common test data version: 1.1.0 be3ae66
class BinarySearchTreeTest < Minitest::Test
  def test_insert
    # skip
    n1 = Node.new(5)
    n1.insert(1)
    n1.insert(8)
    n1.insert(3)

    n2 = n1.left
    n3 = n1.right
    n4 = n2.right

    assert_equal 1, n2.data
    assert_equal 8, n3.data
    assert_equal 3, n4.data
  end

  def test_contain
    # skip
    n1 = Node.new(5)
    n1.insert(1)
    n1.insert(8)
    n1.insert(3)

    n2 = n1.left
    n3 = n1.right
    n4 = n2.right

    assert_equal true, n1.contain(3) != nil
    assert_equal false, n1.contain(12) != nil
  end
end

__END__
```

## BST Implementation

Create file `binary_search_trees.rb`:

```ruby
class Node
    attr_reader :data
    attr_accessor :left, :right

    def initialize(data)
        @data = data
        @left = nil
        @right = nil
    end

    def insert(data)
        if data < @data && @left == nil
            @left = Node.new(data)
        elsif data < @data && @left != nil
            @left.insert(data)
        elsif data > @data && @right == nil
            @right = Node.new(data)
        elsif data > @data && @right != nil
            @right.insert(data)
        end
    end

    def contain(data)
        if @data == data
            return self
        elsif data < @data && @left != nil
            @left.contain(data)
        elsif data > @data && @right != nil
            @right.contain(data)
        end
    end
end
```

## Testing

Change into directory and run `ruby binary_search_trees_test.rb`.
