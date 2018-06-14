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
  file: 'test.html',
  default: {
    img: true,
    a: true,
    title: true,
    descriptions: true,
    keywords: true,
    strong: 3,
    h1: true
  }
}

letseo(options)
```
