module.exports = function(bh) {
    bh.match('calendar', function(ctx) {
        ctx.js({ val: ctx.json().val });
    });
};
