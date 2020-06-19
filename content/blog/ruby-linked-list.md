---
title: Ruby Linked List
date: "2018-10-09"
description: Ruby implementation of a basic unidirectional Linked List.
---

This requires the gem installation of `minitest`.

## Test file

Create file `linked_list_test.rb`:

```ruby
begin
  gem 'minitest', '>= 5.0.0'
  require 'minitest/autorun'
  require_relative 'linked_list'
rescue Gem::LoadError => e
  puts "\nMissing Dependency:\n#{e.backtrace.first} #{e.message}"
  puts 'Minitest 5.0 gem must be installed for the Ruby track.'
rescue LoadError => e
  puts "\nError:\n#{e.backtrace.first} #{e.message}"
  puts DATA.read
  exit 1
end

# Common test data version: 1.1.0 be3ae66
class LinkedListTest < Minitest::Test
  def test_get_size
    # skip
    n1 = Node.new(1)
    ll = LinkedList.new(n1)
    assert_equal 1, ll.getSize()
  end

  def test_insert_first
    # skip
    n1 = Node.new(1)
    n2 = Node.new(1)
    ll = LinkedList.new(n1)
    ll.insertFirst(n2)
    assert_equal 2, ll.getSize()
  end

  def test_clear
    # skip
    n1 = Node.new(1)
    n2 = Node.new(1)
    ll = LinkedList.new(n1)
    ll.insertFirst(n2)
    ll.clear()
    assert_equal 0, ll.getSize()
    assert_nil nil, ll.getFirst()
  end
end

__END__
```

## Linked List

Create file `linked_list.rb`:

```ruby
class LinkedList
    def initialize(head=nil)
        if head.nil?
            @size = 0
        else
            @size = 1
        end
        @head = head
    end

    def getSize
        @size
    end

    def insertFirst(n)
        if @head.nil?
            @head = n
        else
            tmp = @head
            @head = n
            n.setNext(tmp)
        end
        @size += 1
    end

    def clear
        @head = nil
        @size = 0
    end

    def getFirst
        @head
    end
end

class Node
    def initialize(data = nil)
        @data = data
        @next = nil
    end

    def getNext
        @next
    end

    def setNext(n)
        @next = n
    end
end
```

## Testing

Change into directory and run `ruby linked_list_test.rb`.
