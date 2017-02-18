block('input').mod('has-calendar', true)(
    def()(function() {
        var ctx = this.ctx;

        return applyNext({ _calendar: {
            earlierLimit: ctx.earlierLimit,
            laterLimit: ctx.laterLimit,
            weekdays: ctx.weekdays,
            months: ctx.months
        } });
    }),
    elem('box').content()(function() {
        return [
            applyNext(),
            { elem: 'calendar' },
            {
                block: 'calendar',
                mods: { theme: 'islands' },
                js: this._calendar
            }
        ];
    })
);
