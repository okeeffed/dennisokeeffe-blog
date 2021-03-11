---
title: Diagrams With Mermaid
date: "2018-12-18"
description: Checkout how to create dynamic diagrams using mermaid!
---

This is a small intro into building HTML diagrams on the fly.

I really, really want to be able to visualise some stacks I am building on the go down the track, so I thought this would be a very convenient way to explore that.



## Getting started

### tl;dr

```bash
create-react-app hello-mermaid
cd hello-mermaid
yarn add mermaid debounce
```

### Basics

For this particular example, I decided just to use `create-react-app hello-mermaid` just to get things up and going.

Once this installs, changed into the folder and either `yarn add mermaid` or `npm install mermaid --save`.

In this scenario, I want to also dynamically update the chart, so also add in `yarn add debounce` or `npm install debounce --save` as I will use a `textarea` html element for this which I want to only fire once after being debounced. Check my [blog post on debouncing in React](https://www.dennisokeeffe.com/blog/react-debounce) for more information.



## The code

I decided to start using the [the intro learn page for mermaid](https://mermaidjs.github.io/usage.html) to get up an going. Following the instructions, I updated my `src/App.js` file to look like the following:

```javascript
import React, { Component } from "react"
import "./App.css"
import mermaid from "mermaid"
import debounce from "debounce"

class App extends Component {
  /**
   * Debounce the code first. When the function
   * fires, take the value and attempt to update
   * the Mermaid chart.
   *
   * @memberof App
   */
  handleChange = debounce(
    value => {
      console.log(value)
      var output = document.getElementById("output")
      try {
        mermaid.parse(value)

        output.innerHTML = ""

        mermaid.render("theGraph", value, function(svgCode) {
          console.log(svgCode)
          output.innerHTML = svgCode
        })
      } catch (err) {
        console.error(err)
      }
    },
    600,
    false
  )

  /**
   * Render an initial chart on mount.
   *
   * @memberof App
   */
  componentDidMount() {
    var output = document.getElementById("output")
    mermaid.initialize({ startOnLoad: true })

    var graphDefinition = `graph TB
    a-->b
    b-->a`

    mermaid.render("theGraph", graphDefinition, function(svgCode) {
      output.innerHTML = svgCode
    })
  }

  render() {
    return (
      <div className="App">
        <textarea rows="4" onChange={e => this.handleChange(e.target.value)} />
        <div id="output" />
      </div>
    )
  }
}

export default App
```

What's going on here? First of all, I am importing the required packages.

```javascript
// code omitted for brevity
import mermaid from "mermaid"
import debounce from "debounce"
```

Secondly, I have updated the render code to give me a `div` to target with the outputted graph and a text area I can add markdown into:

```javascript
render() {
    return (
      <div className="App">
        <textarea
          rows="4"
          onChange={(e) => this.handleChange(e.target.value)}
        />
        <div id="output" />
      </div>
    );
  }
```

Third, I want to initialise the graph with a basic chart:

```javascript
/**
   * Render an initial chart on mount.
   *
   * @memberof App
   */
  componentDidMount() {
    var output = document.getElementById('output');
    mermaid.initialize({ startOnLoad: true });

    // definition comes from mermaid
    var graphDefinition = `graph TB
    a-->b
    b-->a`;

    mermaid.render('theGraph', graphDefinition, function(svgCode) {
      output.innerHTML = svgCode;
    });
  }
```

Finally, I add the `handleChange` function to attempt an update to the graph.

```javascript
/**
 * Debounce the code first. When the function
 * fires, take the value and attempt to update
 * the Mermaid chart.
 *
 * @memberof App
 */
handleChange = debounce(
  value => {
    console.log(value)
    var output = document.getElementById("output")
    try {
      // use the mermaid parse first to
      // ensure code is parsable. If not,
      // throw an error, handle it gracefully
      // and do nothing.
      mermaid.parse(value)

      output.innerHTML = ""

      mermaid.render("theGraph", value, function(svgCode) {
        console.log(svgCode)
        output.innerHTML = svgCode
      })
    } catch (err) {
      console.error(err)
    }
  },
  600,
  false
)
```

When we run `yarn start` on the terminal and the web page opens up, we get the following image:

![Initial app](https://res.cloudinary.com/gitgoodclub/image/upload/v1537746495/hlhp7gcpqov7bynrs6nj.png "Initial app")

Great! Now thanks to our `handleChange` function and graceful handling, we can also dynamically update the chart on the fly.

I've added a few examples from the web that you can now copy and paste into our text box to see how it works!

```
graph LR
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
```

![Graph](https://res.cloudinary.com/gitgoodclub/image/upload/v1537746496/uvxm9akwbfhd7p7jqllj.png "Graph")

```
sequenceDiagram
    Alice->>+John: Hello John, how are you?
    Alice->>+John: John, can you hear me?
    John-->>-Alice: Hi Alice, I can hear you!
    John-->>-Alice: I feel great!
```

![Sequence diagram](https://res.cloudinary.com/gitgoodclub/image/upload/v1537746496/xw34lkevrva04sib3yt0.png "Sequence diagram")

```
gantt
       dateFormat  YYYY-MM-DD
       title Adding GANTT diagram functionality to mermaid

       section A section
       Completed task            :done,    des1, 2014-01-06,2014-01-08
       Active task               :active,  des2, 2014-01-09, 3d
       Future task               :         des3, after des2, 5d
       Future task2              :         des4, after des3, 5d

       section Critical tasks
       Completed task in the critical line :crit, done, 2014-01-06,24h
       Implement parser and jison          :crit, done, after des1, 2d
       Create tests for parser             :crit, active, 3d
       Future task in critical line        :crit, 5d
       Create tests for renderer           :2d
       Add to mermaid                      :1d

       section Documentation
       Describe gantt syntax               :active, a1, after des1, 3d
       Add gantt diagram to demo page      :after a1  , 20h
       Add another diagram to demo page    :doc1, after a1  , 48h

       section Last section
       Describe gantt syntax               :after doc1, 3d
       Add gantt diagram to demo page      :20h
       Add another diagram to demo page    :48h
```

![Gantt](https://res.cloudinary.com/gitgoodclub/image/upload/v1537746497/cjsznl54jbf1qhsxdhfg.png "Gantt chart")



## Next steps

Very cool! Now we can easily start creating some cool dynamic flows. What next? Be creative! I am planning to parse the markdown or html from the outputs and use it to help generate important reports or pseudocode to help build out some infrastructure or database schemas.

[You can see the final code on the repo here.](https://github.com/okeeffed/hello-mermaid)

[Also, checkout their docs to see what else you can do!](https://mermaidjs.github.io/)

_**Depth** is a series that goes into more detail for projects than it's friendly counterpart series "Hello"._
