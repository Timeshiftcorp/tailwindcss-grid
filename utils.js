const _ = require('lodash')
const prefixes = {
  '.gtr': 'gridTemplateRows',
  '.gtc': 'gridTemplateColumns',
  '.grid': 'display',
  '.gf': 'gridAutoFlow',
  '.gtr': 'gridTemplateRows',
  '.gcs': 'gridColumnStart',
  '.gce': 'gridColumnEnd',
}

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

function getkeyName(name) {
  for (const key in prefixes) {
    if (key === '.' + name) {
      return key;
    }
  }
}

function getValue(key) {
  return prefixes['.' + key];
}
module.exports = {
  setClass: (key, value) => {
    if (typeof value == 'object')
      return value.map(function (vl) {
        return {
          [getkeyName(key) + `-${vl}`]: {
            [getValue(key)]: vl,
          },
        }
      })
    else {
      return {
        [getkeyName(key)]: {
          [getValue(key)]: value,
        },
      }
    }

  },

  setGaps: (gaps, e) => {
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
  },

  autoMinWidth: (autoMinWidths, e) => {
    return _.map(autoMinWidths, (size, name) => ({
      [`.${e(`grid-automin-${name}`)}`]: {
        gridTemplateColumns: `repeat(auto-fit, minmax(${size}, 1fr))`,
      },
    }));
  },

  setGridManipulations: (grids, key) => {
    return grids.map(columns => ({
      [`${getkeyName(key)}-${columns}`]: {
        [getValue(key)]: `repeat(${columns}, 1fr)`,
      },
    }))
  },

  setColRowStartEnd: (grids) => {
    return _.range(1, _.max(grids) + 2).map(line => ({
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
    }))
  },



  getArea: (area, grids) => {
    if (area) {
      return cartesian(getArray(_.max(grids))).map(span =>
        ({
          [`.area-${span.join('\\/')}`]: {
            gridArea: `${span.join('/')}`,
          },
        }))
    }
    return [];
  },

  setColumnsRows: (grids) => {
    return _.range(1, _.max(grids) + 1).map(span =>
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

    )
  },

  setColRowSpans: (grids) => {
    return _.range(1, _.max(grids) + 1).map(span => ({
      [`.row-span-${span}`]: {
        gridRowStart: `span ${span}`,
      },
      [`.-row-span-${span}`]: {
        gridRowStart: `span ${-span}`,
      },
      [`.col-span-${span}`]: {
        gridColumnStart: `span ${span}`,
      },
      [`.-col-span-${span}`]: {
        gridColumnStart: `span ${-span}`,
      },
    }))
  }


  // export {
  //   cartesian,
  //   setClass,
  //   setColRowSpans,
  //   setColRowStartEnd,
  //   setGaps,
  //   setGridManipulations,
  //   autoMinWidth,
  //   setColumnsRows,
  //   getArray,
  //   getValue,
  //   getkeyName,
  //   getArea,


}
