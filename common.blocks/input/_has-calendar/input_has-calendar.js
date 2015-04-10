/**
 * @module input
 */
modules.define('input', ['i-bem__dom', 'bh', 'jquery', 'ua'], function(provide, BEMDOM, bh, $, ua) {

function compareMonths(a, b) {
    if(a.getFullYear() > b.getFullYear())
        return 1;

    if(a.getFullYear() < b.getFullYear())
        return -1;

    if(a.getMonth() > b.getMonth())
        return 1;

    if(a.getMonth() < b.getMonth())
        return -1;

    return 0;
}

function leadZero(num) {
    return num < 10 ? '0' + num : num;
}

/**
 * @exports
 * @class input
 * @augments control
 * @bem
 */
provide(BEMDOM.decl({ block : this.name, modName: 'has-calendar' }, /** @lends input.prototype */{
    onSetMod: {
        js: function() {
            this.__base.apply(this, arguments);

            this.today = new Date();
            this.today.setHours(0);
            this.today.setMinutes(0);
            this.today.setSeconds(0);
            this.today.setMilliseconds(0);

            this._month = new Date(this.today.getTime());
            this._month.setDate(1);

            this.setLimits(
                this.parseDate(this.params.earlierLimit),
                this.parseDate(this.params.laterLimit)
            );

            this.bindTo('calendar', 'pointerclick', function(e) {
                e.preventDefault();
            });

            // Всегда показывать календарь, если кликнули в поле
            this.bindTo('control', 'pointerclick', function() {
                this.showCalendar();
            }.bind(this));

            this.bindTo('calendar', 'pointerclick', function(e) {
                if(this.isShownCalendar()) {
                    e.stopPropagation();
                    this.hideCalendar();
                } else {
                    this.showCalendar();
                }
            }.bind(this));

            this._isFocusHackNeed = ua.msie && parseInt(ua.version, 10) <= 8;
        },

        focused: function(mod, newVal, oldVal) {
            if(this._isFocusHackNeed && this._isBlurOnCalendar) {
                this._isBlurOnCalendar = false;
                this.elem('control').focus();

                return false;
            }

            if(newVal === oldVal) return;

            newVal === 'yes' ?
                this.showCalendar() :
                this.hideCalendar();

            !newVal && this._setDateOnBlur();

            return this.__base.apply(this, arguments);
        }
    },

    showCalendar: function() {
        this._selected = this.parseDate(this.getVal());

        if(this._selected && !this._isValidDate(this._selected)) {
            this._selected = null;
        }

        if(this._selected) {
            this._month = new Date(this._selected.getTime());
            this._month.setDate(1);
        }

        this._buildCalendar();

        var popup = this._getCalendarPopup();
        popup.setAnchor(this.domElem);
        popup.setMod('visible', true);

        BEMDOM.append(popup.domElem);
    },

    hideCalendar: function() {
        this._getCalendarPopup().delMod('visible');
    },

    isShownCalendar: function() {
        return this._getCalendarPopup().hasMod('visible');
    },

    switchMonth: function(step) {
        this._month.setMonth(this._month.getMonth() + step);

        this.nextTick(function() {
            this._buildCalendar();
        });
    },

    getCalendar: function(month) {
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

    parseDate: function(val) {
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

        var parsed = parseDateParts(val);

        if(parsed) {
            var day = parsed[0],
                month = parsed[1],
                year = parsed[2],
                date = new Date(this.today.getTime());

            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);

            date.setMonth(month, day);

            if(year) {
                date.setFullYear(year);
            }

            return date;
        }

        return null;
    },

    setLimits: function(earlier, later) {
        this._earlierLimit = earlier;
        this._laterLimit = later;

        var value = this.parseDate(this.getVal());

        if(value && !this._isValidDate(value))
            this.setVal('');

        if(earlier && compareMonths(this._month, earlier) < 0)
            this._month = new Date(earlier.getTime());

        if(later && compareMonths(later, this._month) < 0)
            this._month = new Date(later.getTime());

        this._month.setDate(1);
    },

    destruct: function() {
        this._calendarPopup && this._calendarPopup.destruct();
    },

    _setDateOnBlur: function() {
        this._selected = this.parseDate(this.getVal());

        if(!this._selected) {
            this.setVal('');
            return;
        }

        if(!this.isShownCalendar()) {
            return;
        }

        this._onChange(this._formatDate(this._selected));
    },

    _formatDate: function(date) {
        var year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate();

        return [leadZero(day), leadZero(month), year].join('.');
    },

    _popupBEMJSON: function() {
        return {
            block: 'popup',
            mods: {
                autoclosable: true,
                target: 'anchor',
                theme: 'islands'
            },
            mix: this.params.popupMix,
            js: true,
            content: ''
        };
    },

    _getCalendarPopup: function() {
        if(!this._calendarPopup) {
            this._calendarPopup = $(bh.apply(this._popupBEMJSON())).bem('popup');

            this._calendarPopup.bindTo('pointerclick', function(e) {
                if(this._isFocusHackNeed) {
                    this._isBlurOnCalendar = true;
                }

                e.preventDefault();
            }.bind(this));

            this._calendarPopup.on('outside-click', function(e, domEvent) {
                $(domEvent.target).closest(this.domElem.add(this._calendarPopup)).length
                    && e.preventDefault();
            }.bind(this));
        }

        return this._calendarPopup;
    },

    _onChange: function(date) {
        this.setVal(date);
        this.hideCalendar();

        this.emit('change', this.parseDate(date));
    },

    _isValidDate: function(day) {
        return !(this._earlierLimit && day < this._earlierLimit ||
            this._laterLimit && day > this._laterLimit);
    },

    _buildCalendar: function() {
         var month = this._month,
            prevMonth = !this._earlierLimit || compareMonths(month, this._earlierLimit) > 0,
            nextMonth = !this._laterLimit || compareMonths(this._laterLimit, month) > 0,
            calendar,
            layout,
            row,
            rows = [],
            content;


        var title = {
            elem: 'title',
            content: [
                {
                    elem: 'arrow',
                    mods: {
                        direction: 'left',
                        disabled: !prevMonth
                    }
                },
                {
                    elem: 'arrow',
                    mods: {
                        direction: 'right',
                        disabled: !nextMonth
                    }
                },
                {
                    elem: 'name',
                    content: this.params.months[month.getMonth()] + ' ' + month.getFullYear()
                }
            ]
        };

        row = [];

        this.params.weekdays.forEach(function(name, i) {
            var dayname = {
                elem: 'dayname',
                tag: 'th',
                content: name
            };

            if(i > 4) {
                dayname.mods = { type: 'weekend' };
            }

            row.push(dayname);
        });

        rows.push(row);

        this.getCalendar(month).forEach(function(week) {
            row = [];

            var _this = this;
            $.each(week, function(i, day) {
                var off = !_this._isValidDate(day),
                    weekend = i > 4,
                    dayElem = {
                        elem: 'day',
                        tag: 'td',
                        content: {
                            elem: 'inner',
                            content: day ? day.getDate() : ''
                        },
                        attrs: {},
                        mods: {}
                    };

                if(day && !off) {
                    dayElem.attrs['data-day'] = _this._formatDate(day);
                }

                if(off || weekend) {
                    dayElem.mods.type = weekend ? (off ? 'weekend-off' : 'weekend') : 'off';
                }

                if(day && _this._selected && day.getTime() === _this._selected.getTime()) {
                    dayElem.mods.state = 'current';
                }

                row.push(dayElem);
            });

            rows.push(row);
        }, this);

        content = [];

        rows.forEach(function(row) {
            content.push({
                elem: 'row',
                tag: 'tr',
                content: row
            });
        });

        layout = {
            elem: 'layout',
            tag: 'table',
            attrs: { cellspacing: '0' },
            content: content
        };

        calendar = $(bh.apply({
            block: 'calendar',
            mods: { theme: 'islands' },
            content: [
                title,
                layout
            ]
        })).bem('calendar');

        var leftArrow = calendar.elem('arrow', 'direction', 'left'),
            rightArrow = calendar.elem('arrow', 'direction', 'right');

        if(!calendar.hasMod(leftArrow, 'disabled', 'yes')) {
            calendar.bindTo(leftArrow, 'pointerclick', function(e) {
                e.preventDefault();
                e.stopPropagation();

                this.switchMonth(-1);
            }.bind(this));
        }

        if(!calendar.hasMod(rightArrow, 'disabled', 'yes')) {
            calendar.bindTo(rightArrow, 'pointerclick', function(e) {
                e.preventDefault();
                e.stopPropagation();

                this.switchMonth(1);
            }.bind(this));
        }

        calendar.bindTo('day', 'pointerclick', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var date = $(e.currentTarget).data('day');
            date && this._onChange(date);
        }.bind(this));

        this._getCalendarPopup().setContent(calendar.domElem);

        return calendar;
    }

}));
});
