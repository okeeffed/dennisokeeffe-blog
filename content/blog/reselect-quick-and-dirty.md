---
title: Reselect Quick And Dirty
date: "2019-05-25"
description: The tl;dr reminder of how Reselect works for Redux state memoization.
---

# Reselect Quick and Dirty

Quick and dirty implementation of `reselect`. This assumes you already have the requirements for Redux installed and in operation.

## Links

This link below is a great reference for indepth if you need more than a friendly reminder.

[Dan Parker - Medium article](https://medium.com/@parkerdan/react-reselect-and-redux-b34017f8194c)

## Installing Reselect

```bash
yarn install reselect
```

## Basic Implementation

```javascript
// Reducer file
import { createSelector } from "reselect"

/* Creating the Selector in reducer file */
const getElementsUi = state => state.sidebarReducer.elementsUi

export const getElementsUiState = createSelector(
  [getElementsUi],
  elementsUi => elementsUi
)

// In file calling mapStateToProps
const mapStateToProps = state => ({
  elementsUi: reducers.getElementsUiState(state),
})

const mapDispatchToProps = dispatch => ({ dispatch: dispatch })

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
```
