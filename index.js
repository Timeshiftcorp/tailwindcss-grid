const _ = require('lodash')
const ut = require('./utils.js');



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
        ut.setClass('grid', 'grid'),
        ut.setClass('gf', ['dense', 'row', 'column', 'row-dense', 'column dense']),
        ut.setGaps(gaps, e),
        ut.setGridManipulations(grids, 'gtc'),
        ut.setGridManipulations(grids, 'gtr'),
        ut.autoMinWidth(autoMinWidths, e),
        ut.setColRowSpans(grids),
        ut.getArea(area, grids),
        ut.setColumnsRows(grids),
        ut.setColRowStartEnd(grids),

      ],
      variants,
    )
  }
}
