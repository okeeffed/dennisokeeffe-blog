import React, { useEffect } from "react"

export const AdUnit = props => {
  const { currentPath } = props
  useEffect(() => {
    window.adsbygoogle = window.adsbygoogle || []
    window.adsbygoogle.push({})
  }, [currentPath])
  return (
    <div
      style={{
        marginLeft: 0,
        marginRight: 0,
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3242257428325939"
        data-ad-slot="1495933395"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  )
}
