---
title: Hello Shave
date: "2018-10-15"
description: What do you do when your content becomes super long?
---

Have you ever run into the issue of grids breaking when content input is too long? While there are a number of solutions to restraining height on elements, one that I like comes in [Shave from the Dollar Shave Club](https://github.com/dollarshaveclub/shave).

<Ad />

## Installation

```bash
# npm
npm install --save shave
# or yarn
yarn add shave
```

<Ad />

## Usage

_Incredibly simple_.

```javascript
// code omitted for brevity
import shave from "shave"

// restrain height to 70px
const selector = ".shave"
const height = 70
shave(selector, height)
```

<Ad />

## Before vs after

![Issue beforehand](https://res.cloudinary.com/gitgoodclub/image/upload/v1537397946/xbcnkdybmc2npdn1zldi.png "Broken grids")

![Issue after](https://res.cloudinary.com/gitgoodclub/image/upload/v1537397999/wvn8ekrm0czo9qvxvv93.png "Fixed grids")

_**Hello** is a series that is about short, sharp examples. Read more on this series to find small gems to add your toolset._
