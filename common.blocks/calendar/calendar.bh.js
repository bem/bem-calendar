module.exports = function(bh) {
    bh.match('calendar', function(ctx) {
        var mods = ctx.mods();

        ctx.mix({
            block: 'popup',
            mods: {
                'has-calendar': true,
                target: 'anchor',
                theme: mods.theme
            }
        });
    });
};
