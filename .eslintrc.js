module.exports = {
    "extends": "standard"
};

module.exports = {
  root: true,
  parserOptions: {
    'parser': 'babel-eslint', // for dynamic import
  },
  env: {
    "browser": true,
    "node": true
  },
  extends: ['standard', 'plugin:prettier/recommended'],
  rules: {
    'space-after-function-name': 0, // to avoid conflict with prettier
    'no-throw-literal': 0,
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        arrowParens: 'always'
      }
    ]
  }
}
