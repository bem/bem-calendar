module.exports = function(bh) {
    bh.match('input_has-calendar__control', function(ctx, json) {
        return [
            ctx.json(),
            {
                elem: 'calendar'
            }
        ]
    });

    bh.match('input_readonly__control', function(ctx) {
        ctx.attr('readonly', 'readonly');
    });
};
