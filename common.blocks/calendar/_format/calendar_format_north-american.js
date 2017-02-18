modules.define('calendar', function(provide, Calendar) {

    provide(Calendar.declMod({ modName: 'format', modVal: 'north-american' }, {
        onSetMod: {
            js: {
                inited: function() {
                    this.__base.apply(this, arguments);
                }
            }
        },
        _formatDate: function() {
            var dateArray = this.__base.apply(this, arguments).split('.');
            swap(dateArray, 0, 1);
            return dateArray.join('/');
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

                weekDay = dateIterator.getDay();
                week[weekDay] = new Date(dateIterator.getTime());

                if(weekDay === lastDay) {
                    weeks.push(week);
                    week = new Array(countDays);
                    week[0] = new Date(dateIterator.getTime());
                }
            }
            if(weekDay !== lastDay) {
                weeks.push(week);
            }
            return weeks;
        },
        _isWeekend: function(dayNumber) {
            return dayNumber === 0 || dayNumber === 6;
        }
    }));

    function swap(arr, x, y) {
        var temp = arr[x];
        arr[x] = arr[y];
        arr[y] = temp;
    }
});
