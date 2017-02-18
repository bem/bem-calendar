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

    bh.match('input_has-calendar__box', function(ctx) {
        var box = ctx.json();

        box.content = [].concat(
            box.content,
            { elem: 'calendar' },
            {
                block: 'calendar',
                mods: {
                    theme: 'islands',
                    format: ctx.node.mods ? ctx.node.mods['calendar-format'] : false
                },
                js: ctx.tParam('calendar')
            }
        );

        return box;
    });
};
