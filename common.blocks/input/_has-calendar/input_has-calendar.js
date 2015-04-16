/**
 * @module input
 */
modules.define('input', ['i-bem__dom', 'jquery', 'dom'], function(provide, BEMDOM, $, dom) {

/**
 * @exports
 * @class input
 * @augments control
 * @bem
 */
provide(BEMDOM.decl({ block : this.name, modName: 'has-calendar' }, /** @lends input.prototype */{
    onSetMod: {
        js: function() {
            this.__base.apply(this, arguments);

            this._calendar = this.findBlockInside('calendar');

            this._calendar
                .setVal(this.getVal())
                .setAnchor(this.domElem)
                .on('change', function(e, data) {
                    this.setVal(data.formated);
                }.bind(this));

            this.bindTo('control', 'focus pointerclick', function() {
                if(!this._calendar.isShown()) {
                    this._calendar
                        .setVal(this.getVal())
                        .show();
                }
            }.bind(this));

            this.bindTo('control', 'blur', function(e) {
                    if(this._ignoreBlur) {
                        this._ignoreBlur = false;
                    } else {
                        this._calendar.hide();
                    }
            }.bind(this));

            this.bindTo('calendar', 'pointerclick', function(e) {
                if(this._calendar.isShown()) {
                    this._calendar.hide();
                } else {
                    this._calendar
                        .setVal(this.getVal())
                        .show();
                }
            }.bind(this));

            this.bindToDoc('pointerdown', function(e) {
                var target = $(e.target),
                    insideCalendar = dom.contains(this._calendar.domElem, target);

                if(insideCalendar) {
                    this._ignoreBlur = true;
                }

                if(!insideCalendar && !dom.contains(this.domElem, target)) {
                    this._calendar.hide();
                }
            });
        }
    },
    destruct: function() {
        this._calendar.destruct();

        this.__base.apply(this, arguments);
    }
}));
});
