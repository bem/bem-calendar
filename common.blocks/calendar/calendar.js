/**
 * @module calendar
 */
modules.define('calendar', ['i-bem-dom', 'BEMHTML', 'jquery', 'popup'], function(provide, bemDom, BEMHTML, $, Popup) {

function compareMonths(a, b) {
    if(a.getFullYear() > b.getFullYear()) {
        return 1;
    }

    if(a.getFullYear() < b.getFullYear()) {
        return -1;
    }

    if(a.getMonth() > b.getMonth()) {
        return 1;
    }

    if(a.getMonth() < b.getMonth()) {
        return -1;
    }

    return 0;
}

function leadZero(num) {
    return num < 10 ? '0' + num : num;
}

function parseDateParts(str) {
    var match;

    match = /^\s*(\d{1,2})[./-](\d{1,2})(?:[./-](\d{4}|\d\d))?\s*$/.exec(str);

    if(match) {
        return [match[1], match[2] - 1, match[3]];
    }

    match = /^\s*(\d{4})[./-](\d\d)(?:[./-](\d\d))?\s*$/.exec(str);

    if(match) {
        return [match[3], match[2] - 1, match[1]];
    }

    return null;
}

/**
 * @exports
 * @class calendar
 * @augments control
 * @bem
 */
provide(bemDom.declBlock(this.name, /** @lends calendar.prototype */{
    onSetMod: {
        js: {
            inited: function() {
                this.__base.apply(this, arguments);

                this._val = null;

                this._popup = this.domElem.bem(Popup);

                this._month = this._getToday();
                this._month.setDate(1);

                this.setLimits(
                    this.params.earlierLimit,
                    this.params.laterLimit
                );
            },

            '': function() {
                this._popup && bemDom.destruct(this._popup.domElem);
            }
        }
    },

    /**
     * Get value
     *
     * @returns {?Date}
     */
    getVal: function() {
        return this._val;
    },

    /**
     * Set value
     *
     * @param {Date|string} val
     * @returns {calendar} this
     */
    setVal: function(val) {
        var date = this.parseDate(val);
        this._val = this._isValidDate(date) ? date : null;

        if(this._val) {
            this._month = new Date(this._val.getTime());
            this._month.setDate(1);
        }

        return this;
    },

    /**
     * Show calendar
     *
     * @returns {calendar} this
     */
    show: function() {
        this._build();

        this._popup.setMod('visible', true);

        return this;
    },

    /**
     * Hide calendar
     *
     * @returns {calendar} this
     */
    hide: function() {
        this._popup.delMod('visible');

        return this;
    },

    /**
     * Is shown calendar?
     *
     * @returns {boolean}
     */
    isShown: function() {
        return this._popup.hasMod('visible');
    },

    /**
     * Switch month
     *
     * @param {number} step
     * @returns {calendar} this
     */
    switchMonth: function(step) {
        this._month.setMonth(this._month.getMonth() + step);

        this._nextTick(this._build);

        return this;
    },

    /**
     * Parse date
     *
     * param {Date|string} val
     * @returns {?Date} this
     */
    parseDate: function(val) {
        if(val instanceof Date) {
            return val;
        }

        var parsed = parseDateParts(val);
        if(parsed) {
            var day = parsed[0],
                month = parsed[1],
                year = parsed[2],
                date = this._getToday();

            date.setMonth(month, day);

            if(year) {
                date.setFullYear(year);
            }

            return date;
        }

        return null;
    },

    /**
     * Set target
     *
     * @param {jQuery|BEMDOM} anchor - DOM elem or anchor BEMDOM block.
     * @returns {calendar} this
     */
    setAnchor: function(anchor) {
        this._popup.setAnchor(anchor);

        return this;
    },

    /**
     * Sets directions for calendar.
     *
     * @param {Array<string>} directions
     * @returns {calendar} this
     */
    setDirections: function(directions) {
        this._popup.params.directions = directions;

        return this;
    },

    /**
     * Sets limits
     *
     * @param {Date|String} earlier
     * @param {Date|String} later
     * @returns {calendar} this
     */
    setLimits: function(earlier, later) {
        this._earlierLimit = this.parseDate(earlier);
        this._laterLimit = this.parseDate(later);

        if(earlier && compareMonths(this._month, this._earlierLimit) < 0) {
            this._month = new Date(this._earlierLimit.getTime());
        }

        if(later && compareMonths(this._laterLimit, this._month) < 0) {
            this._month = new Date(this._laterLimit.getTime());
        }

        this._month.setDate(1);

        return this;
    },

    _getToday: function() {
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        return today;
    },

    _formatDate: function(date) {
        var year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate();

        return [leadZero(day), leadZero(month), year].join('.');
    },

    _isValidDate: function(date) {
        return !(this._earlierLimit && date < this._earlierLimit ||
            this._laterLimit && date > this._laterLimit);
    },

    _build: function() {
        var rows = [];

        rows.push(this._buildShortWeekdays());
        rows = rows.concat(this._buildMonth(this._month));

        var calendar = $(BEMHTML.apply({
            block: 'calendar',
            elem: 'container',
            content: [
                this._buildTitle(this._month),
                {
                    elem: 'layout',
                    tag: 'table',
                    content: rows.map(function(row) {
                        return {
                            elem: 'row',
                            tag: 'tr',
                            content: row
                        };
                    })
                }
            ]
        }));

        this._popup.setContent(calendar);
    },

    _calcWeeks: function(month) {
        var weekDay,
            weeks = [],
            countDays = 7,
            lastDay = 6,
            week = new Array(countDays),
            dateIterator = new Date(month.getTime());

        for(dateIterator.setDate(1); dateIterator.getMonth() === month.getMonth(); dateIterator.setDate(dateIterator.getDate() + 1)) {
            weekDay = (dateIterator.getDay() + lastDay) % countDays; // Получаем 0 - пн, 1 - вт, и т.д.

            week[weekDay] = new Date(dateIterator.getTime());

            if(weekDay === lastDay) {
                weeks.push(week);
                week = new Array(countDays);
            }
        }

        if(weekDay !== lastDay) {
            weeks.push(week);
        }

        return weeks;
    },

    _buildMonth: function(month) {
        var rows = [];

        this._calcWeeks(month).forEach(function(week) {
            var row = [],
                _this = this;
            $.each(week, function(i, day) {
                var off = !_this._isValidDate(day),
                    val = _this.getVal(),
                    weekend = i > 4,
                    dayElem = {
                        elem: 'day',
                        tag: 'td',
                        content: {
                            elem: 'inner',
                            content: day ? day.getDate() : ''
                        },
                        attrs: {},
                        elemMods: {}
                    };

                if(day && !off) {
                    dayElem.attrs['data-day'] = _this._formatDate(day);
                }

                if(off || weekend) {
                    dayElem.elemMods.type = weekend ? (off ? 'weekend-off' : 'weekend') : 'off';
                }

                if(day && val && day.getTime() === val.getTime()) {
                    dayElem.elemMods.state = 'current';
                }

                row.push(dayElem);
            });

            rows.push(row);
        }, this);

        return rows;
    },

    _buildShortWeekdays: function() {
        var row = [];

        this.params.weekdays.forEach(function(name, i) {
            var dayname = {
                elem: 'dayname',
                tag: 'th',
                content: name
            };

            if(i > 4) {
                dayname.elemMods = { type: 'weekend' };
            }

            row.push(dayname);
        });

        return row;
    },

    _buildTitle: function(month) {
        var prevMonth = !this._earlierLimit || compareMonths(month, this._earlierLimit) > 0,
            nextMonth = !this._laterLimit || compareMonths(this._laterLimit, month) > 0;

        return {
            elem: 'title',
            content: [
                {
                    elem: 'arrow',
                    elemMods: {
                        direction: 'left',
                        disabled: !prevMonth
                    }
                },
                {
                    elem: 'arrow',
                    elemMods: {
                        direction: 'right',
                        disabled: !nextMonth
                    }
                },
                {
                    elem: 'name',
                    content: this.params.months[month.getMonth()] +
                        ' ' + month.getFullYear()
                }
            ]
        };
    }
},  /** @lends calendar */ {
    lazyInit: false,

    onInit: function () {
        this._domEvents('arrow').on('pointerclick', function(e) {
            var elem = $(e.currentTarget);
            if(!this.hasMod(elem, 'disabled')) {
                this.switchMonth(this.hasMod(elem, 'direction', 'left') ? -1 : 1);
            }
        });

        this._domEvents('day').on('pointerclick', function(e) {
            var date = $(e.currentTarget).data('day');
            if(date) {
                this.setVal(date);
                this.hide();

                var val = this.getVal();
                this._emit('change', {
                    value: val,
                    formated: this._formatDate(val)
                });
            }
        });
    }
}));

});
