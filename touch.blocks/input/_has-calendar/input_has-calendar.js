/**
 * @module input
 */
modules.define('input', ['i-bem__dom'], function(provide, BEMDOM) {

/**
 * @exports
 * @class input
 * @augments control
 * @bem
 */
provide(BEMDOM.decl({ block : this.name, modName: 'has-calendar' }, /** @lends input.prototype */{
    onSetMod: {
        js: function() {
            this.elem('control').attr('readonly', 'readonly');

            this.__base.apply(this, arguments);
        }
    }
}));
});
