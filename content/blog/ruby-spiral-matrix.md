---
title: Ruby Spiral Matrix
date: "2018-07-15"
description: Ruby Spiral Matrices with unit testing.
---

This requires the gem installation of `minitest`.

## Test file

Create file `spiral-matrix_test.rb`:

```ruby
begin
  gem 'minitest', '>= 5.0.0'
  require 'minitest/autorun'
  require_relative 'spiral_matrix'
rescue Gem::LoadError => e
  puts "\nMissing Dependency:\n#{e.backtrace.first} #{e.message}"
  puts 'Minitest 5.0 gem must be installed for the Ruby track.'
rescue LoadError => e
  puts "\nError:\n#{e.backtrace.first} #{e.message}"
  puts DATA.read
  exit 1
end

# Common test data version: 1.1.0 be3ae66
class SpiralMatrixTest < Minitest::Test
  def test_two_by_two_matrix
    expected = [[1,2],[4,3]]
    assert_equal expected, SpiralMatrix.gen(2)
  end

  def test_three_by_three_matrix
    expected = [[1,2,3],[8,9,4], [7,6,5]]
    assert_equal expected, SpiralMatrix.gen(3)
  end
end

__END__
```

## Spiral Matrix

Create file `spiral-matrix.rb`:

```ruby
class SpiralMatrix
    def self.gen(dim)
        mat = Array.new(dim) { Array.new(dim)}

        count = 1
        startRow = 0
        startCol = 0
        endRow = dim - 1
        endCol = dim - 1

        while startRow <= endRow && startCol <= endCol
            # top row
            i = startCol
            while i <= endCol do
                mat[startRow][i] = count
                count += 1
                i += 1
            end
            startRow += 1

            # far col
            i = startRow
            while i <= endRow do
                mat[i][endCol] = count
                count += 1
                i += 1
            end
            endCol -= 1

            # bottow row
            i = endCol
            while i >= startCol do
                mat[endRow][i] = count
                count += 1
                i -= 1
            end
            endRow -= 1

            # closest col
            i = endRow
            while i >= startRow do
                mat[i][startCol] = count
                count += 1
                i -= 1
            end
            startCol += 1
        end

        return mat
    end
end
```

## Testing

Change into directory and run `ruby spiral-matrix_test.rb`.
