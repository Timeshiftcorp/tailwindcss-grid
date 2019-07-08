const _ = require('lodash')

function cartesian() {
  var r = [], arg = arguments[0], max = arg.length - 1;
  function helper(arr, i) {
    for (var j = 0, l = arg[i].length; j < l; j++) {
      var a = arr.slice(0); // clone arr
      a.push(arg[i][j]);
      if (i == max)
        r.push(a);
      else
        helper(a, i + 1);
    }
  }
  helper([], 0);
  return r;
}

function getArray(num) {
  return Array.from({ length: 4 }, () => Array.from({ length: num }, (el, index) => index + 1));
}

prefixes = {
  '.gtr': 'gridTemplateRows',
  '.gtc': 'gridTemplateColumns',
  '.grid': 'display',
  '.grid-dense': 'gridAutoFlow',
  '.gtc': 'gridTemplateColumns',
  '.gtr': 'gridTemplateRows',
  '.gcs': 'gridColumnStart',
  '.gce': 'gridColumnEnd',

}

function getkeyName(name) {
  for (const key in prefixes) {
    if (key === '.' + name) {
      return key;
    }
  }
};

function getValue(key) {
  return prefixes['.' + key];
}

function setClass(key, value) {
  return {
    [getkeyName(key)]: {
      [getValue(key)]: value,
    },
  }
}
function setGaps(gaps, e) {
  return _.map(gaps, (size, name) => {
    const gridGap = name.endsWith('-y') ?
      'gridRowGap' :
      name.endsWith('-x') ?
        'gridColumnGap' :
        'gridGap'

    return {
      [`.${e(`grid-gap-${name}`)}`]: {
        [gridGap]: size,
      },
    }
  })
}
function autoMinWidth(autoMinWidths, e) {
  return _.map(autoMinWidths, (size, name) => ({
    [`.${e(`grid-automin-${name}`)}`]: {
      gridTemplateColumns: `repeat(auto-fit, minmax(${size}, 1fr))`,
    },
  }));
}

function setGridManipulations(grids, key) {
  return grids.map(columns => ({
    [`${getkeyName(key)}-${columns}`]: {
      [getValue(key)]: `repeat(${columns}, 1fr)`,
    },
  }))
}

module.exports = function ({
  grids = _.range(1, 13),
  gaps = {},
  area = false,
  autoMinWidths = {},
  variants = ['responsive'],
}) {
  return function ({
    e,
    addUtilities
  }) {
    addUtilities(
      [
        setClass('grid', 'grid'),
        setClass('grid-dense', 'dense'),
        setGaps(gaps, e),
        setGridManipulations(grids, 'gtc'),
        setGridManipulations(grids, 'gtr'),
        autoMinWidth(autoMinWidths, e),
        ..._.range(1, _.max(grids) + 1).map(span => ({
          [`.col-span-${span}`]: {
            gridColumnStart: `span ${span}`,
          },
        })),
        ...area ? cartesian(getArray(_.max(grids))).map(span =>
          ({
            [`.area-${span.join('\\/')}`]: {
              gridArea: `${span.join('/')}`,
            },
          })) : [],

        ..._.range(1, _.max(grids) + 1).map(span =>
          _.range(1, _.max(grids) + 1).map(i => ({
            [`.col-${i}\\/${span}`]: {
              gridColumn: `${i}/${span + 1}`,
            },
            [`.-col-${i}\\/${span}`]: {
              gridColumn: `${-i - 1}/${-span}`,
            },
            [`.row-${i}\\/${span}`]: {
              gridRow: `${i}/${span + 1}`,
            },
            [`.-row-${i}\\/${span}`]: {
              gridRow: `${-i - 1}/${-span}`,
            },

          }))

        ),
        ..._.range(1, _.max(grids) + 2).map(line => ({
          [`.col-start-${line}`]: {
            gridColumnStart: `${line}`,
          },
          [`.-col-start-${line}`]: {
            gridColumnStart: `${-line}`,
          },

          [`.col-end-${line}`]: {
            gridColumnEnd: `${line}`,
          },
          [`.-col-end-${line}`]: {
            gridColumnStart: `${-line}`,
          },
        })),
        ..._.range(1, _.max(grids) + 1).map(span => ({
          [`.row-span-${span}`]: {
            gridRowStart: `span ${span}`,
          },
          [`.-row-span-${span}`]: {
            gridRowStart: `span ${-span}`,
          },
        })),
        ..._.range(1, _.max(grids) + 2).map(line => ({
          [`.row-start-${line}`]: {
            gridRowStart: `${line}`,
          },
          [`.-row-start-${line}`]: {
            gridRowStart: `${-line}`,
          },
          [`.row-end-${line}`]: {
            gridRowEnd: `${line}`,
          },
          [`.-row-end-${line}`]: {
            gridRowStart: `${-line}`,
          },
        })),
      ],
      variants,
    )
  }
}
