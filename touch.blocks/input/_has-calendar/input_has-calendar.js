/**
 * @module input
 */
modules.define('input', function(provide, Input) {

/**
 * @exports
 * @class input
 * @augments control
 * @bem
 */
provide(Input.declMod({ modName: 'has-calendar', modVal: 'true' }, /** @lends input.prototype */{
    onSetMod: {
        js: function() {
            this._elem('control').domElem.attr('readonly', 'readonly');

            this.__base.apply(this, arguments);
        }
    }
}));
});
