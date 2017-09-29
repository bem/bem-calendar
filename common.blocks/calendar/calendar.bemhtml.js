block('calendar')(
    js()(function() {
        var js = this.ctx.js;
        js.val = this.ctx.val;
        return js || true;
    })
);
