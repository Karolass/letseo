# letseo

Search SEO defects from HTML files

## Install
```
npm install letseo
```

## Default Usage

```javascript
const letseo = require('letseo')

const options = {
  input: 'test.html', // HTML file path
  output: 'test.txt', // result output path
  print: true,  // default: true
  
  // default rules
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
    // tag is exist or not
    { tag: 'video' },
    
    // tag is more than specific count
    { tag: 'h2', limit: { type: 'upper', count: 2 }},
    
    // attribute value of tag is exist or not
    { tag: 'meta', attr: { name: 'property', value: 'og:url' }},
    { tag: 'meta', attr: { name: 'name', value: 'robots' }}
  ]
}

letseo(options)
```

## Node Stream Usage

```javascript
const letseo = require('./index')
const fs = require('fs')

const options = { ... } // remove input and output

fs.createReadStream('test.html')
  .pipe(letseo(options))
  .pipe(fs.createWriteStream('test.txt'))
```
