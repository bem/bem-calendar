modules.define('calendar', function(provide, Calendar) {

    provide(Calendar.declMod({ modName: 'format', modVal: 'north-american' }, {
        _formatDate: function(date) {
            var month = date.getMonth() + 1,
                day = date.getDate();

            return [month < 10 ? '0' + month : month, day < 10 ? '0' + day : day, date.getFullYear()].join('/');
        },
        _parseDateParts: function() {
            var date = this.__base.apply(this, arguments);
            if(date) {

                return {
                    day: date.month + 1,
                    month: date.day - 1,
                    year: date.year
                };
            }
        },
        _processWeek: function(dateIterator, week, weeks, lastDay, countDays) {
            var weekDay = dateIterator.getDay();
            week[weekDay] = new Date(dateIterator.getTime());

            if(weekDay === lastDay) {
                weeks.push(week);
                week = new Array(countDays);
                week[0] = new Date(dateIterator.getTime());
            }

            return { week: week, weekDay: weekDay };
        },
        _isWeekend: function(dayNumber) {
            return dayNumber === 0 || dayNumber === 6;
        }
    }));
});
