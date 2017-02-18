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

                this._calendar = this.findChildBlock(Calendar)
                    .setVal(this.getVal())
                    .setAnchor(this.domElem);

                this._events(this._calendar).on('change', function(e, data) {
                    this.setVal(data.formated);
                });

                this._domEvents(bemDom.doc).on('pointerdown', function(e) {
                    var target = $(e.target),
                        insideCalendar = dom.contains(this._calendar.domElem, target);

                    this._ignoreBlur = insideCalendar;
                });
            },
            '': function() {
                bemDom.destruct(this._calendar.domElem);
                this.__base.apply(this, arguments);
            }
        },
        focused: {
            'true': function() {
                this.__base.apply(this, arguments);

                if(this._calendar.isShown()) return;

                this._calendar
                    .setVal(this.getVal())
                    .show();
            },
            '': function() {
                this.__base.apply(this, arguments);

                if(this._ignoreBlur) {
                    this._ignoreBlur = false;
                } else {
                    this._calendar.hide();
                }
            }
        }
    },
    onCalendarClick: function() {
        if(this._calendar.isShown()) {
            this._calendar.hide();
        } else {
            this._calendar
                .setVal(this.getVal())
                .show();
        }
    }
}, {
    onInit: function() {
        this._domEvents('calendar').on('pointerclick', this.prototype.onCalendarClick);

        this.__base.apply(this, arguments);
    }
}));

});
