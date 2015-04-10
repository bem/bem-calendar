BEM.DOM.decl({ name : 'input', modName : 'has-calendar', modVal : 'yes' }, {
    onSetMod: {
        js: function() {
            this.elem('control').attr('readonly', 'readonly');
            this.__base.apply(this, arguments);
        }
    }
});
