---
title: D3 Word Cloud with Create React App
date: "2019-05-10"
description: Creating a D3 word cloud from a base Create React App project.
---

# Creating a D3 Word Cloud using Create React App

## Initialise CRA App

First of all, initalise the React app:

```shell
create-react-app d3-wordcloud && cd d3-wordcloud
```

## Install D3 Deps

For this particular case, we want to install a particular set of D3 libs:

```shell
yarn add d3-scale d3-cloud d3-selection
```

## Setting Up Our Data Stub

For simplicity sake, let's create a JSON set of data that we can use to pass down into our final component.

In the `src` directory, let's create `data.json` and add the following data:

```json
{
  "data": [
    { "text": "frequency", "frequency": 63 },
    { "text": "function", "frequency": 61 },
    { "text": "data", "frequency": 47 },
    { "text": "return", "frequency": 36 },
    { "text": "attr", "frequency": 29 },
    { "text": "chart", "frequency": 28 },
    { "text": "array", "frequency": 24 },
    { "text": "style", "frequency": 24 },
    { "text": "layouts", "frequency": 22 },
    { "text": "values", "frequency": 22 },
    { "text": "need", "frequency": 21 },
    { "text": "nodes", "frequency": 21 },
    { "text": "pie", "frequency": 21 },
    { "text": "use", "frequency": 21 },
    { "text": "figure", "frequency": 20 },
    { "text": "circle", "frequency": 19 },
    { "text": "we'll", "frequency": 19 },
    { "text": "zoom", "frequency": 19 },
    { "text": "append", "frequency": 17 },
    { "text": "elements", "frequency": 17 }
  ]
}
```

We will import this JSON and pass it down to create the final file.

## Updating App.js

Now, let's update our `App.js` from it's initial state to the following:

```javascript
import React, { Component } from "react"
import logo from "./logo.svg"
import "./App.css"
import WordCloud from "./WordCloud"
import wordData from "./data.json"

class App extends Component {
  render() {
    return (
      <div className="App">
        <WordCloud
          id="wcloud"
          w="600"
          h="600"
          data={wordData.data}
          threshold={25}
        />
      </div>
    )
  }
}

export default App
```

There are some important steps to note from what we just did:

1. We imported the data from `data.json`
2. We imported our `WordCloud` component from the `WordCloud.js` file
3. We add properties `id`, `w`, `h`, `data` and `threshold` - we will explore these properties a little bit later.

If you try running the app at the moment, it will evidently fail given we haven't created the `WordCloud.js` file - so let's do just that.

## Creating the WordCloud

With the `src` folder, let's create a `WordCloud.js` file.

Let's fill out the `WordCloud.js` file with the following:

```javascript
import React, { Component } from "react"
import { scaleLinear } from "d3-scale"
import cloud from "d3-cloud"
import { select } from "d3-selection"

/**
 * A D3 reusable Word Cloud
 *
 * @example
 * // sample usage with import
 * <WordCloud id="wcloud" w="600" h="600" data={wordData.data} threshold={25}/>
 *
 * @class WordCloud
 * @extends {Component}
 */
class WordCloud extends Component {
  componentDidMount() {
    this.drawChart()
  }

  drawChart() {
    const { id, w, h, data, threshold = 20 } = this.props

    const wordScale = scaleLinear()
      .domain([0, 75])
      .range([10, 120])

    const randomRotate = scaleLinear()
      .domain([0, 1])
      .range([-20, 20])

    cloud()
      .size([500, 500])
      .words(data)
      .rotate(() => randomRotate(Math.random()))
      .rotate(d => (d.text.length > 5 ? 0 : 90))
      .fontSize(d => wordScale(d.frequency))
      .on("end", draw)
      .start()

    function draw(words) {
      const svg = select("#" + id)
        .append("svg")
        .attr("height", h)
        .attr("width", w)
        .append("g")
        .attr("id", "wordCloud")
        .attr("transform", `translate(${w / 2},${h / 2})`)

      svg
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", d => d.size + "px")
        .style("fill", d => (d.frequency > threshold ? "#fe9922" : "#4f442b"))
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .text(d => d.text)
    }
  }

  render() {
    return (
      <div
        id={this.props.id}
        style={{
          width: this.props.w,
          height: this.props.h,
        }}
      />
    )
  }
}

export default WordCloud
```

What you'll note here is that our `render` function returns ONLY a div that will have a few properties to define the `id` and `width` and `height` style properties.

Secondly, we have an `componentDidMount` method that calls our `drawChart` function - this is important for appending our required SVG elements.

Thirdly, our `drawChart` function makes use of each of our props with a default value of 20 for `threshold`.

Our chart should now be up and looking pretty!

![D3 WordCloud](https://res.cloudinary.com/gitgoodclub/image/upload/v1553669573/blog/Screen_Shot_2019-03-27_at_5.20.02_pm.png)

Bam - our JSON data is defining the words required for the cloud and the colour is being determined by `threshold` parameter that we are using. Play around with this threshold to update the colour or remove it to use the default value of 20!

This is just a simple word colour. You could change the colour function or play around with it however you want from here.
