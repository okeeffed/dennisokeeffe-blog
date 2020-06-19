# PHP Constructors

This is a overly simplified application of a how to use constructors in PHP with a very limited `LinkedList` class that omits most common methods.

The main point of this post is to show how to create classes that in turn can be used to create instances using `__construct`.

```php
class LinkedList {
    public $size = 0;
    public $head;

    function __construct($head = null) {
        $this->head = $head;

        if ($head != null) {
            $this->size = 1;
        } else {
            $this->size = 0;
        }
    }

    public function insertFirst($n) {
        if ($this->head != null) {
            $tmp = $this->head;
            $this->head = $n;
            $n->setNext($tmp);
        } else {
            $this->head = $n;
        }
        $this->size++;
    }

    public function getFirst() {
        return $this->head;
    }
}

class Node {
    private $data;
    private $next;

    function __construct($data = null) {
        $this->data = $data;
    }

    public function getData() {
        return $this->data;
    }

    public function setData($data) {
        $this->data = $data;
    }

    public function getNext() {
        return $this->next;
    }

    public function setNext($next) {
        $this->next = $next;
    }
}

$n1 = new Node(1);
$n2 = new Node(2);
$ll = new LinkedList($n1);
$ll->insertFirst($n2);
$ll->getFirst(); // returns $n2
```
