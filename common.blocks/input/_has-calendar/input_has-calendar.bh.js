module.exports = function(bh) {
    bh.match('input_readonly__control', function(ctx) {
        ctx.attr('readonly', 'readonly');
    });

    bh.match('input_has-calendar', function(ctx, json) {
        ctx.tParam('calendar', {
            earlierLimit: json.earlierLimit,
            laterLimit: json.laterLimit,
            weekdays: json.weekdays,
            months: json.months
        });
    });

    bh.match('input_has-calendar__control', function(ctx) {
        return [
            ctx.json(),
            {
                elem: 'calendar'
            }
        ]
    });

    bh.match('input_has-calendar__box', function(ctx) {
        return [
            ctx.json(),
            {
                block: 'calendar',
                mods: {
                    theme: 'islands'
                },
                js: ctx.tParam('calendar')
            }
        ]
    });
};
