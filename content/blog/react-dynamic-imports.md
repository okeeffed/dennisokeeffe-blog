---
title: React Dynamic Imports
date: "2018-09-12"
description: See example code for dynamically importing a React Component.
---



## Example Code

The key action happens by using React's `componentDidMount` lifecycle method and component state, although the application of when to import can be used anywhere when required.

```javascript
componentDidMount() {
    import('components/ComponentB').then((module) =>
        this.setState({ module: module.default })
    );
}
```

Here is the full code example:

```javascript
import React, { Component } from "react"

/**
 * Dynamically load ComponentB.
 *
 * @class ComponentA
 * @extends {Component}
 */
class ComponentA extends Component {
  constructor(props) {
    super(props)

    this.state = {
      module: null,
    }
  }

  /**
   * On mount, dynamically fetch ComponentB.
   *
   * @memberof ComponentA
   */
  componentDidMount() {
    import("components/ComponentB").then(module =>
      this.setState({ module: module.default })
    )
  }

  /**
   * Render ComponentA component.
   *
   * @memberof ComponentA
   * @returns {ComponentA} component Basic div with dynamically loaded child
   */
  render() {
    const { module: ComponentB } = this.state
    return (
      <div className="component-a">
        {ComponentB && <ComponentB {...this.props} />}
      </div>
    )
  }
}

export default ComponentA
```

_**Hello** is a series that is about short, sharp examples. Read more on this series to find small gems to add your toolset._
