/**
 * @module calendar
 */
modules.define('calendar', ['i-bem-dom', 'BEMHTML', 'jquery'], function(provide, bemDom, BEMHTML, $) {

function compareMonths(a, b) {
    return (a.getFullYear() - b.getFullYear()) * 100 + a.getMonth() - b.getMonth();
}

function leadZero(num) {
    return num < 10 ? '0' + num : num;
}

/**
 * @exports
 * @class Calendar
 * @bem
 */
provide(bemDom.declBlock(this.name, /** @lends calendar.prototype */{
    onSetMod: {
        js: {
            inited: function() {
                this._val = null;
                this._selectedDayElem = null;
                this._firstDayIndex = -1;
                var today = this._getToday(),
                    params = this.params;

                this._month = today;
                this._month.setDate(1);

                this.setLimits(params.earlierLimit, params.laterLimit);

                this.setVal(this._isValidDate(params.val) ? params.val : today);

                if(!this._elem('container')) {
                    this._build();
                }

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
     * @param {Date|String} val - Date or date as string
     * @returns {Calendar} this
     */
    setVal: function(val) {
        var date = this.parseDate(val);
        this._val = this._isValidDate(date) ? date : null;

         if(this._val) {
            var shouldRebuild = this._month.getMonth() !== date.getMonth() ||
                                this._month.getFullYear() !== date.getFullYear();

            this._month = new Date(this._val.getTime());
            this._month.setDate(1);

            if(!this._elem('container') || shouldRebuild) {
                this._build();
            } else {
                this._selectDayElem(
                    this._elems('day')
                        .get(this._firstDayIndex + this._val.getDate() - 1)
                );
            }

            this._emit('change', {
                value: this._val,
                formated: this._formatDate(this._val)
            });
        }
        return this;
    },

    /**
     * Switch month
     *
     * @param {Number} step - Months count
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
     * @param {Date|String} val - Date or date as string
     * @returns {?Date}
     */
    parseDate: function(val) {
        if(val instanceof Date) return val;

        var parsed = this._parseDateParts(val);
        if(parsed) {
            var day = parsed.day,
                month = parsed.month,
                year = parsed.year,
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
     * Sets limits
     *
     * @param {Date|String} [earlier] - left limit
     * @param {Date|String} [later] - right limit
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
    /**
     * @typedef {object} DateHash
     *
     * @param {Number|String} day
     * @param {Number|String} month
     * @param {Number|String} year
     */

    /**
     * Parses string date
     *
     * @param {Date|String} [str] - input date
     * @returns {?DateHash} output date
     */
    _parseDateParts: function(str) {
        var match = /^\s*(\d{1,2})[./-](\d{1,2})(?:[./-](\d{4}|\d\d))?\s*$/.exec(str);

        if(match) {
            return {
                day: match[1],
                month: match[2] - 1,
                year: match[3]
            };
        }

        match = /^\s*(\d{4})[./-](\d\d)(?:[./-](\d\d))?\s*$/.exec(str);

        if(match) {
            return {
                day: match[3],
                month: match[2] - 1,
                year: match[1]
            };
        }

        return null;
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
    _isWeekend: function(dayNumber) {
        return dayNumber > 4;
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
        bemDom.update(this.domElem, calendar);
        this._selectedDayElem = this.findChildElem({ elem: 'day', modName: 'state', modVal: 'current' });
    },

    _calcWeeks: function(month) {
        var weekDay,
            weeks = [],
            countDays = 7,
            lastDay = 6,
            week = new Array(countDays),
            dateIterator = new Date(month.getTime());

        for(
            dateIterator.setDate(1);
            dateIterator.getMonth() === month.getMonth();
            dateIterator.setDate(dateIterator.getDate() + 1)
        ) {
            var iterationResult = this._processWeek(dateIterator, week, weeks, lastDay, countDays);
            week = iterationResult.week;
            weekDay = iterationResult.weekDay;
        }

        if(weekDay !== lastDay) {
            weeks.push(week);
        }

        return weeks;
    },
    _processWeek: function(dateIterator, week, weeks, lastDay, countDays) {
        var weekDay = (dateIterator.getDay() + lastDay) % countDays; // Получаем 0 - пн, 1 - вт, и т.д.

        week[weekDay] = new Date(dateIterator.getTime());

        if(weekDay === lastDay) {
            weeks.push(week);
            week = new Array(countDays);
        }
        return { week: week, weekDay: weekDay };
    },
    _buildMonth: function(month) {
        var rows = [];
        this._calcWeeks(month).forEach(function(week) {
            var row = [],
                _this = this;
            $.each(week, function(i, day) {
                var off = !_this._isValidDate(day),
                    val = _this.getVal(),
                    weekend = _this._isWeekend(i),
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
                    if(_this._firstDayIndex === -1) {
                        _this._firstDayIndex = i;
                    }
                }

                if(weekend) {
                    dayElem.elemMods.type = off ? 'weekend-off' : 'weekend';
                } else if(off) {
                    dayElem.elemMods.type = 'off';
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

            if(this._isWeekend(i)) {
                dayname.elemMods = { type: 'weekend' };
            }

            row.push(dayname);
        }, this);

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
    },

    _onArrowClick: function(e) {
        var arrow = e.bemTarget;
        if(!arrow.hasMod('disabled')) {
            this.switchMonth(arrow.hasMod('direction', 'left') ? -1 : 1);
        }

    },

    _onDayClick: function(e) {
        var date = $(e.currentTarget).data('day');
        if(!date) return;

        this.setVal(date);
    },

    _selectDayElem: function(element) {
        if(this._selectedDayElem) {
            this._selectedDayElem.delMod('state');
        }
        element.setMod('state', 'current');
        this._selectedDayElem = element;
    }
},  /** @lends calendar */ {
    lazyInit: false,

    onInit: function() {
        this._domEvents('arrow').on('pointerclick', this.prototype._onArrowClick);
        this._domEvents('day').on('pointerclick', this.prototype._onDayClick);
    }
}));

});
