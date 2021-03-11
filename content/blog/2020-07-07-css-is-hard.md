---
title: 7 CSS Tips To Save Your Sanity
description: CSS is hard. In fact, I preach day in and day out that it one of the more difficult concepts to grasp effectively. Here are 7 tips to help you scale and manage CSS and its alternatives.
date: "2020-07-07"
---

Change my mind: CSS is hard. In fact, I preach day in and day out that scalable CSS is one of the more difficult concepts to grasp effectively. Here are 7 tips to help you scale and manage CSS and its alternatives.



## 1: Keep Architecture Front Of Mind

To be able to scale styling effectively, you need to first think of the grander picture.

**No amount of styling finesse will help you if your application cannot scale.**

An example to provide here is the popular concept of [Atomic design](https://atomicdesign.bradfrost.com/chapter-2/). While it is not the only paradigm out there, it is a great example into how you can think about how the parts of your application come together.

Atomic design is inspired by chemistry and attempts to take things from first principles. From this, Brad has broken down designs into five parts:

1. Atoms
2. Molecules
3. Organisms
4. Templates
5. Pages

While this post is not a deep dive into that thinking framework (nor others), identifying and isolating smaller components from larger ones such as the pages will go a long way into how you begin to organize your style files and avoid repetitiveness.



## 2: Where Appropriate, Use Processors

Pre and post processors such as [Sass](https://sass-lang.com/), [Less](http://lesscss.org/) and [Post-CSS](https://github.com/postcss/postcss) power up your workflow with style sheets and enable powerful modularity.

Simple concepts like nesting in Sass and Less can make a world of difference to ensure your styles don't "bleed" into other style rules unintentionally.

For example, take the following trivial example:

```html
<div class="home-page">
  <div class="component-one">
    <div class="container">
      <p>Hello</p>
    </div>
  </div>
  <div class="component-two">
    <div class="container">
      <p>World!</p>
    </div>
  </div>
</div>
```

What happens if we add the follow stylesheet?

```css
.container {
  background-color: #000;
}
```

What naturally follows are two `.container` divs with a black background. Trivial? Yes. A troublesome reality? Also yes.

What happens if this is unintentional? While the example itself is trivial, what happens in a large scale app if your class name matches that in another part of the website? **Unintentional side-effects, that's what.**

Even the basics of nesting can help you prevent this:

```scss
.component-one {
  .container {
    background-color: #000;
  }
}

.component-two {
  .container {
    background-color: #fff;
  }
}
```

As for tools like Post-CSS, it enables you to harness popular plugins such as the [autoprefixer](https://github.com/postcss/autoprefixer) which enables you to forget about vendor prefixes altogether. You can see from their base example on the site how powerful this utility can be:

Before autoprefixer:

```css
::placeholder {
  color: gray;
}

.image {
  background-image: url(image@1x.png);
}
@media (min-resolution: 2dppx) {
  .image {
    background-image: url(image@2x.png);
  }
}
```

After processing with the autoprefixer:

```css
::-moz-placeholder {
  color: gray;
}
:-ms-input-placeholder {
  color: gray;
}
::-ms-input-placeholder {
  color: gray;
}
::placeholder {
  color: gray;
}

.image {
  background-image: url(image@1x.png);
}
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
  .image {
    background-image: url(image@2x.png);
  }
}
```

As you can see, we no longer have to write rules for variant of browser - **a most troublesome foe indeed.**

Cool - so we've managed to save ourselves some code and are preventing some side-effects with the basic capabilities of pre-processors, but we are still in a bit of a pickle. We can still abuse these powers and end up in a mess. So what can we do next?



## 3: Find Structures That Work For Your Team

There are a number of paradigms, naming conventions and ordering tips that can help make traversing stylesheets easier. Here is a list of a few:

1. [BEM - Block Element Modifier](http://getbem.com/)
2. [SMACSS - Scalable and Modular Architecture for CSS](http://smacss.com/)
3. [RSCSS - Reasonable System for CSS Stylesheet Structure](https://rscss.io/index.html)
4. [Outside in ordering](https://webdesign.tutsplus.com/articles/outside-in-ordering-css-properties-by-importance--cms-21685)
5. [Object-orientated CSS](https://github.com/stubbornella/oocss/wiki)

### BEM

[BEM](<(http://getbem.com/)>) is a popular style of class naming convention that is approachable and helps you understand the purpose of a class from first-glance. This is an introduction from their home page of this application in action:

```html
<button class="button">
  Normal button
</button>
<button class="button button--state-success">
  Success button
</button>
<button class="button button--state-danger">
  Danger button
</button>
```

```css
.button {
  display: inline-block;
  border-radius: 3px;
  padding: 7px 12px;
  border: 1px solid #d5d5d5;
  background-image: linear-gradient(#eee, #ddd);
  font: 700 13px/18px Helvetica, arial;
}
.button--state-success {
  color: #fff;
  background: #569e3d linear-gradient(#79d858, #569e3d) repeat-x;
  border-color: #4a993e;
}
.button--state-danger {
  color: #900;
}
```

The idea is that from seeing the `button` is the **block**, the `state` is the **modifier** and the variant (success/danger) is the `value` which leads the convention to `block--modifier-value`. There are a number of different preferences for implementing BEM based on preference ie `block--modifier__value` is another popular approach.

### Outside-In Ordering

For me, this is an incredibly underrated helper. [Outside-in](https://webdesign.tutsplus.com/articles/outside-in-ordering-css-properties-by-importance--cms-21685) is simply a way to describe ordering your CSS within the block scopes.

From the article, it aims to order CSS properties in the following order:

1. Layout Properties (position, float, clear, display)
2. Box Model Properties (width, height, margin, padding)
3. Visual Properties (color, background, border, box-shadow)
4. Typography Properties (font-size, font-family, text-align, text-transform)
5. Misc Properties (cursor, overflow, z-index)

Take the following example without this in mind:

```css
.button {
  font-size: 3em;
  background: #196e76;
  display: inline-block;
  margin: 1em 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  padding: 1em 4em;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  color: #fff;
  border: 0.25em solid #196e76;
  box-shadow: inset 0.25em 0.25em 0.5em rgba(0, 0, 0, 0.3), 0.5em 0.5em 0 #444;
}
```

Now compare it to a block that takes this convention onboard:

```css
.button {
  display: inline-block;
  margin: 1em 0;
  padding: 1em 4em;

  color: #fff;
  background: #196e76;
  border: 0.25em solid #196e76;
  box-shadow: inset 0.25em 0.25em 0.5em rgba(0, 0, 0, 0.3), 0.5em 0.5em 0 #444;

  font-size: 3em;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
}
```

For such a simple concept, the latter block becomes far more approachable and is a small win for developer experience when those properties are grouped into relatable properties.

### OOCSS, SMACSS and RSCSS

All three of these libraries serve as great guides and approaches to styles.

Websites such as [RSCSS](https://rscss.io/index.html) also provide great examples of common pitfalls that developers come across.

With [OOCSS](https://github.com/stubbornella/oocss/wiki), it brings in the common programming paradigm to think object-first to help with re-useability and composition of styles.

[SMACSS](http://smacss.com/) itself self-proclaims to be more of a style guide than a framework, so placing it in this section may be incorrect, but it certainly leads us to the next important point.



## 4: Use Style Guides, Linters and Code Formatters

The beauty about web development is that web developers are the first to create amazing resources for their peers to use! You do not need to ~re-invert the wheel~ make the same mistakes as our predecessors.

Style guides operate as a great resource for helping decide upon the rules and conventions that you as a team wish to use.

Linters can help enforce coding conventions decided upon by the team. This helps enforce rules into the codebase and is a great help for new team members onboarding into the codebase.

Code formatters can bridge the above two and help re-format your stylesheets automatically.

Here is a non-exhaustive list to kick start your research into this:

1. [AirBnb CSS Style Guide](https://github.com/airbnb/css)
2. [Dropbox CSS Style Guide](https://github.com/dropbox/css-style-guide)
3. [Stylelint.io](https://stylelint.io/)
4. [Prettier.io](https://prettier.io/)



## 5: Consider Frameworks That Support Compartmentalization

While this starts to verge outside of the style specific territory, frameworks such as ReactJS in tandem with bundlers such as Webpack allow us to compartmentalize our styles so that they do not affect others.

For a very trivial example, let's take two components `ComponentA` and `ComponentB`:

```css
// ComponentA.css
.component {
  background-color: #000;
}

// ComponentB.css
.component {
  background-color: #fff;
}
```

```js
// ComponentA.jsx
import "ComponentA.css"

const ComponentA = () => <div className="component"></div>

// ComponentB.jsx
import "ComponentB.css"

const ComponentB = () => <div className="component"></div>
```

Thanks to the separation and power of transpilers, the styling applied to both classes can be independent of each other and do not clash. This solves our previous issue around "style bleeding".



## 6: Consider CSS-in-JS

CSS-in-JS has been a _relatively recent_ technology brought into the web development world.

> I say recent, but even two months can feel like an era.

Modern libraries such as [styled-components](https://styled-components.com/) and [Emotion JS](https://github.com/emotion-js/emotion) bring the power of styling into JavaScript. This empowers us to use modern superpowers with ease such as application themes (think dark mode toggles), lets us use JavaScript concepts and data structures to help modify and maintain our styles and enables us to use powerful tooling such as static typing.

For those who want to harness these powers but still prefer the final CSS output, checkout alternatives such as [Treat](https://github.com/seek-oss/treat) which enable you to do this.



## 7: Use Comments

This should be self-explanatory, but I have two requests:

1. Please use them.
2. Please don't write `// HACK: my reason` unless you are playing a prank on some poor developer inheriting your database two years later or you have a **very, very good reason to do so**.

Comments are powerful for humanizing the code and explaining what is happening in understandable terms. They are not an alibi.



## Conclusion

These have been seven tips that I have learned along the way to help with my mortal enemy: CSS.

Here is to hoping that these resources help you in your own battle against maintaining styles!

Do you have any other tips that you have learned along the way? Share them below!



## Resources and Further Reading

1. [AirBnb CSS Style Guide](https://github.com/airbnb/css)
2. [Dropbox CSS Style Guide](https://github.com/dropbox/css-style-guide)
3. [Stylelint.io](https://stylelint.io/)
4. [Prettier.io](https://prettier.io/)
5. [BEM - Block Element Modifier](http://getbem.com/)
6. [SMACSS - Scalable and Modular Architecture for CSS](http://smacss.com/)
7. [RSCSS - Reasonable System for CSS Stylesheet Structure](https://rscss.io/index.html)
8. [Outside in ordering](https://webdesign.tutsplus.com/articles/outside-in-ordering-css-properties-by-importance--cms-21685)
9. [Object-orientated CSS](https://github.com/stubbornella/oocss/wiki)
10. [Atomic design](https://atomicdesign.bradfrost.com/chapter-2/)
11. [Sass](https://sass-lang.com/)
12. [Less](http://lesscss.org/)
13. [Post-CSS](https://github.com/postcss/postcss)

_Image credit: [Jerry Wang](https://unsplash.com/@jerry_318)_