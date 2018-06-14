# letseo

Search SEO defects from HTML files

## Install
```
npm install letseo
```

## Usage

```javascript
const letseo = require('letseo')

const options = {
  file: {
    input: 'test.html',
    output: 'test.txt'
  },
  print: true,  // default: true
  default: {
    img: true, // default: true
    a: true, // default: true
    title: true, // default: true
    descriptions: false, // default: true
    keywords: true, // default: true
    strong: 5, // default: 15
    h1: 2 // default: 1
  },

  // Customize rules
  rules: [
    { tag: 'video' }, // tag is exist or not
    { tag: 'h2', limit: { type: 'upper', count: 2 }}, // tag is more than specific count
    { tag: 'meta', attr: { name: 'property', value: 'og:url' }} // attribute value of tag is exist or not
  ]
}

letseo(options)
```
