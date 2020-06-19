---
title: React Portal Basics
date: "2018-12-22"
description: An introduction to React Portals.
---

# React Portals Basics

## Why Portals?

A great use case for portals is for use with things like React modals. Anything that uses a stack context can obscure the css position for something like a modal.

The tl;dr is to make a React component a descendent of a HTML element other than `id="root"`;

## Creating a Portal

```javascript
import React from "react"
import ReactDOM from "react-dom"

const Modal = props => {
  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-body" />
    </div>,
    document.querySelector("#modal")
  )
}
```
