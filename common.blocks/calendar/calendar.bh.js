module.exports = function(bh) {
    bh.match('calendar', function(ctx) {
        ctx.mix({
            block: 'popup',
            mods: {
                'has-calendar': true,
                target: 'anchor'
            }
        });
    });
};
