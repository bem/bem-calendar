block('calendar')(
    js()(function() {
        var prevJs = applyNext(),
            js = { val: this.ctx.val };

        return prevJs ? this.extend(prevJs, js) : js;
    })
);
