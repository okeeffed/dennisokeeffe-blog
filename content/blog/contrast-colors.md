
---
title: Contrast Colors
date: "2019-10-22"
description: TODO
---

# Hello Series #5: Auto-determining WCAG contrast standards

Published: September 20th 2018

Short and sharp. I needed to use something to help auto-determine what text color to use for components based on the background color. Also - American spelling for those Australians out there. I know.

## Installation

```bash
# npm
npm install --save get-contrast
# or yarn
yarn add get-contrast
```

## Example code

```javascript
const contrast = require('get-contrast');

const arg = process.argv[2];

if (!arg) {
  console.error('Error: Color arg required eg. "#000"');
  process.exit(1);
}

const isLight = contrast.isAccessible(arg, '#000');
const res = `${arg} is light: ${isLight}. You should use ${
  isLight ? 'black' : 'white'
} for the font.`;

console.log(res);
```

## Usage

```bash
node index.js "#666"
#666 is light: false. You should use white for the font.
node index.js "#000"
#000 is light: false. You should use white for the font.
node index.js "#888"
#888 is light: true. You should use black for the font.
```

Original code [can be found on my Github account](https://github.com/okeeffed/hello-contrast-ratio).

_**Hello** is a series that is about short, sharp examples. Read more on this series to find small gems to add your toolset._

