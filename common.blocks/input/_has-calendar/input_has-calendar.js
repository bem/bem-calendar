/**
 * @module input
 */
modules.define('input', ['i-bem-dom', 'jquery', 'dom', 'calendar'], function(provide, bemDom, $, dom, Calendar, Input) {

/**
 * @exports
 * @class input
 * @augments control
 * @bem
 */
provide(Input.declMod({ modName: 'has-calendar', modVal: true }, /** @lends input.prototype */{
    onSetMod: {
        js: {
            inited: function() {
                this.__base.apply(this, arguments);

                this._calendar = this.findChildBlock(Calendar);

                this._calendar
                    .setVal(this.getVal())
                    .setAnchor(this.domElem);

                this._events(this._calendar).on('change', function(e, data) {
                    this.setVal(data.formated);
                });

                this._events().on({ modName: 'focused', modVal: true }, function() {
                    if (!this._calendar.isShown()) {
                        this._calendar
                            .setVal(this.getVal())
                            .show();
                    }
                });

                this._events().on({ modName: 'focused', modVal: '' }, function() {
                    if(this._ignoreBlur) {
                        this._ignoreBlur = false;
                    } else {
                        this._calendar.hide();
                    }
                });



                this._domEvents(bemDom.doc).on('pointerdown', function(e) {
                    var target = $(e.target),
                        insideCalendar = dom.contains(this._calendar.domElem, target);

                    if(insideCalendar) {
                        this._ignoreBlur = true;
                    }

                    if(!insideCalendar && !dom.contains(this.domElem, target)) {
                        this._calendar.hide();
                    }
                });

                this._domEvents('calendar').on('pointerclick', function() {
                    if(this._calendar.isShown()) {
                        this._calendar.hide();
                    } else {
                        this._calendar
                            .setVal(this.getVal())
                            .show();
                    }
                });
            },

            '': function() {

                bemDom.destruct(this._calendar.domElem);
                this.__base.apply(this, arguments);
            }
        }
    }
}));
});
