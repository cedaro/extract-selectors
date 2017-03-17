/**
 * extract-selectors
 * https://github.com/cedaro/extract-selectors
 *
 * @copyright Copyright (c) 2017 Cedaro, LLC
 * @license MIT
 */

'use strict';

var postcss = require('postcss');

module.exports = postcss.plugin('extract-selectors', function(opts) {
  opts = opts || {};
  var propFilter = opts.prop || '';
  var valueFilter = opts.value || '';

  return function (css, result) {
    var selectorMapping = {};

    css.walkDecls(propFilter, function (decl) {
      var value = decl.value;

      if ('' === valueFilter || value === valueFilter) {
          selectorMapping[value] = selectorMapping[value] || [];
          selectorMapping[value].push(decl.parent.selector);
      }
    });

    result.root = postcss.root();

    Object.keys(selectorMapping).forEach(function(value) {
      var selectors = selectorMapping[value];

      var decl = postcss.decl({
        prop: propFilter,
        value: value,
        raws: {
          before: '\n\t'
        }
      });

      var rule = postcss.rule({
        selector: selectors.join(',\n'),
        raws: {
          before: '\n\n',
          semicolon: true
        }
      }).append(decl);

      result.root.append(rule);
    });
  };
});
