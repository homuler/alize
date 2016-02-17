module.exports = {
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
  },
  'rules': {
    'accessor-pairs': 0,
    'array-callback-return': 0,
    'block-scoped-var': 2,
    'complexity': [1, 15],
    'consistent-return': 2,
    'curly': [2, 'all'],
    'default-case': 2,
    'dot-location': [2, 'property'],
    'dot-notation': [2, { 'allowKeywords': true }],
    'eqeqeq': [2, 'allow-null'],
    'guard-for-in': 2,
    'no-alert': 2,
    'no-caller': 2,
    'no-case-declarations': 2,
    'no-div-regex': 0,
    'no-else-return': 2,
    'no-empty-function': 1,
    'no-empty-pattern': 2,
    'no-eq-null': 0,
    'no-eval': 2,
    'no-extend-native': 2,
    'no-extra-bind': 2,
    'no-extra-label': 2,
    'no-fallthrough': 2,
    'no-floating-decimal': 0,
    'no-implicit-coercion': 0,
    'no-implicit-globals': 2,
    'no-implied-eval': 2,
    'no-invalid-this': 2,
    'no-iterator': 2,
    'no-labels': 0,
    'no-lone-blocks': 2,
    'no-loop-func': 2,
    'no-magic-numbers': 0,
    'no-multi-spaces': [
      2, 
      { 
        'exceptions': { 
          'VariableDeclarator': true,
          'ImportDeclaration': true,
        }
      }
    ],
    'no-multi-str': 2,
    'no-native-reassign': 2,
    'no-new': 2,
    'no-new-func': 2,
    'no-new-wrappers': 2,
    'no-octal': 2,
    'no-octal-escape': 2,
    'no-param-reassign': [1, { 'props': true }],
    'no-process-env': 0,
    'no-proto': 2,
    'no-redeclare': [2, { 'builtinGlobals': true }],
    'no-return-assign': 0,
    'no-script-url': 2,
    'no-self-assign': 2,
    'no-self-compare': 0,
    'no-sequences': 2,
    'no-throw-literal': 2,
    'no-unmodified-loop-condition': 0,
    'no-unused-expression': 0,
    'no-unused-labels': 2,
    'no-useless-call': 2,
    'no-useless-concat': 2,
    'no-void': 0,
    'no-warning-comments': [
      1,
      {
        'terms': ['todo', 'fixme', 'fix me']
      }
    ],
    'no-with': 2,
    'radix': 0,
    'vars-on-top': 1,
    'wrap-iife': [2, 'outside'],
    'yoda': 2,
  },
  'env': {
    'es6': true,
  }
};
