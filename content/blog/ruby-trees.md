---
title: Ruby Trees
date: "2019-04-12"
description: Ruby implementation of a basic node tree and traversal using DFS and BFS.
---

This requires the gem installation of `minitest`.

<Ad />

## Test file

Create file `trees_test.rb`:

```ruby
begin
  gem 'minitest', '>= 5.0.0'
  require 'minitest/autorun'
  require_relative 'trees'
rescue Gem::LoadError => e
  puts "\nMissing Dependency:\n#{e.backtrace.first} #{e.message}"
  puts 'Minitest 5.0 gem must be installed for the Ruby track.'
rescue LoadError => e
  puts "\nError:\n#{e.backtrace.first} #{e.message}"
  puts DATA.read
  exit 1
end

# Common test data version: 1.1.0 be3ae66
class TreeTest < Minitest::Test
  def test_bfs
    # skip
    n4 = Node.new(4)
    n5 = Node.new(5)
    n2 = Node.new(2, [n4])
    n3 = Node.new(3, [n5])
    n1 = Node.new(1, [n2, n3])
    t = Tree.new(n1)
    expected = [1,2,3,4,5]
    res = t.bfs()
    assert_equal expected, res
  end

  def test_dfs
    # skip
    n4 = Node.new(4)
    n5 = Node.new(5)
    n2 = Node.new(2, [n4])
    n3 = Node.new(3, [n5])
    n1 = Node.new(1, [n2, n3])
    t = Tree.new(n1)
    expected = [1,2,4,3,5]
    res = t.dfs()
    assert_equal expected, res
  end
end

__END__
```

<Ad />

## Trees

Create file `trees.rb`:

```ruby
class Tree
    def initialize(root=nil)
        @root = root
    end

    def bfs
        if @root == nil
            raise "No elements in tree"
        end

        arr = [@root]
        res = []
        while arr.length > 0
            # puts arr
            x = arr.shift()
            if x.children != nil
                arr += x.children
            end
            res.push(x.data)
        end
        return res
    end

    def dfs
        if @root == nil
            raise "No root found"
        end

        arr = [@root]
        res = []

        while arr.length > 0
            x = arr.shift()
            if x.children != nil
                arr = x.children + arr
            end
            res.push(x.data)
        end
        return res
    end
end

class Node
    def initialize(data=nil, children=nil)
        @data = data
        @children = children
    end

    def data
        @data
    end

    def children
        @children
    end
end
```

<Ad />

## Testing

Change into directory and run `ruby trees_test.rb`.
