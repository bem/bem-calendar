modules.define('calendar', ['i-bem-dom'], function(provide, Calendar, bemDom) {

    provide(bemDom.declMod({ modName: 'format', modVal: 'north-american' }, {
        onSetMod: {
            js: {
                inited: function() {
                    this.__base.apply(this, arguments);
                    this.parseDate = parseDate;
                    this._calcWeeks = calcWeeks;
                    this._isWeekend = isWeekend;
                    this._formatDate = formatDate;
                }
            }
        }
    }));

    function formatDate(date) {
        var year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate();

        return [leadZero(month), leadZero(day), year].join('/');
    }

    function parseDate(val) {
        if(val instanceof Date) return val;

        var parsed = parseDateParts(val);
        if(parsed) {
            var day = parsed[1],
                month = parsed[0],
                year = parsed[2],
                date = this._getToday();
            date.setMonth(month, day);

            if(year) {
                date.setFullYear(year);
            }

            return date;
        }

        return null;
    }

    function isWeekend(dayNumber) {
        return dayNumber === 0 || dayNumber === 6;
    }

    function calcWeeks(month) {
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

            weekDay = dateIterator.getDay(); // Получаем 0 - вс, 1 - пн, 2 - вт, и т.д.
            week[weekDay] = new Date(dateIterator.getTime());

            if(weekDay === lastDay) {
                weeks.push(week);
                week = new Array(countDays);
                week[0] = new Date(dateIterator.getTime()); // Переносим ВС на след. неделю
            }
        }
        if(weekDay !== lastDay) {
            weeks.push(week);
        }
        return weeks;
    }

    function parseDateParts(str) {
        var match;

        match = /^\s*(\d{1,2})[./-](\d{1,2})(?:[./-](\d{4}|\d\d))?\s*$/.exec(str);

        if(match) {
            return [match[1] - 1, match[2], match[3]];
        }

        match = /^\s*(\d{4})[./-](\d\d)(?:[./-](\d\d))?\s*$/.exec(str);

        if(match) {
            return [match[3], match[2], match[1] - 1];
        }

        return null;
    }
    function leadZero(num) {
        return num < 10 ? '0' + num : num;
    }
});
