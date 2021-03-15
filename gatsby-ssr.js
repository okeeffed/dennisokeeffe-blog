const React = require("react")

exports.onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([
    <script
      data-name="BMC-Widget"
      data-cfasync="false"
      src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
      data-id="dennisokeeffe"
      data-description="Support me on Buy me a coffee!"
      data-message="Did this help your work? Support me with helping others!"
      data-color="#ff813f"
      data-position="Right"
      data-x_margin="18"
      data-y_margin="18"
    ></script>,
  ])
}
