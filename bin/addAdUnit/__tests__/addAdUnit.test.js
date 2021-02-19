const { replaceAd } = require("../addAdUnit")

const md1 = `# Heading

## Second Heading

Does stuff

### Third heading

More stuff`

const md1Expected = `# Heading

<Ad />

## Second Heading

Does stuff

### Third heading

More stuff`

describe("ad unit utility functions", () => {
  describe("markdown replacer", () => {
    test("should update markdown as expected", () => {
      expect(replaceAd(md1)).toEqual(md1Expected)
    })
  })
})
