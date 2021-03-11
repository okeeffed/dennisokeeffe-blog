---
title: Debouncing events in React
date: "2018-09-22"
description: See example code on how to debounce trailing and leading events.
---



## Why debounce?

This excerpt from [John Dugan's blog](https://john-dugan.com/javascript-debounce/) provides a succinct reason:

_Debounce functions are included in many JavaScript libraries. The goal behind each implementation is to reduce overhead by preventing a function from being called several times in succession._

Usage in real world examples can prevent code from executing straight away after typing into a text field or preventing multiple attempts at a form submission.



## Example Code

This example uses the [debounce npm package](https://www.npmjs.com/package/debounce). The first argument is the function we wish to debounce, the second is the debounce time and the third is a boolean on whether we wish to fire the "leading" event (first event fired) or "trailing" event (last event fired after delay time).

In this example, we are debouncing the submission of the form but from the leading event (fire straight away but ignore the following events until delay time has passed without event) and the text input that updates the local state with the trailining event (only fire the last event fired after the delay time).

Note: text input may not always need to be debounced depending on the weight of the operation performed. We are going to assume in this example that there is some intense computation going on.

```javascript
import debounce from "debounce"

/**
 * Form that debounces input and
 * submission.
 *
 * @class DebouncedForm
 * @extends {Component}
 */
class DebouncedForm extends Component {
  state = {
    input: "",
  }

  /**
   * Action the submission of the CTA
   * form. Submits as soon as form button
   * is pressed by debounces the following calls.
   *
   * @memberof DebouncedForm
   * @param {object} event Event parameter
   */
  handleSubmit = debounce(
    () => {
      const { input } = this.state
      // Perform some form of submission
      API.submit(input)
    },
    600,
    true
  )

  /**
   * Update local state based on the input.
   * Debounces so that only the last event
   * fires after debounced time.
   *
   * @memberof DebouncedForm
   * @param {object} event Event parameter
   */
  handleChange = debounce(
    value => {
      // Pretend you are performing a
      // compute heavy task
      this.setState({ input: value })
    },
    600,
    false
  )

  /**
   * Render DebouncedForm component
   * @memberof DebouncedForm
   * @var {function} render Render DebouncedForm component
   * @returns {DebouncedForm} component
   */
  render() {
    return (
      <section className="form">
        <form
          onSubmit={e => {
            e.preventDefault()
            this.handleSubmit()
          }}
        >
          <input
            type="text"
            onChange={e => this.handleChange(e.target.value)}
            placeholder={placeholder}
          />
          <input type="submit" />
        </form>
      </section>
    )
  }
}

export default DebouncedForm
```

_**Hello** is a series that is about short, sharp examples. Read more on this series to find small gems to add your toolset._
