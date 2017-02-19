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

                this._needShowCalendar = true;

                this._calendar = this.findChildBlock(Calendar)
                    .setVal(this.getVal())
                    .setAnchor(this.domElem);

                this._events(this._calendar).on('change', function(e, data) {
                    this._needShowCalendar = false;

                    this
                        .setVal(data.formated)
                        .setMod('focused');
                });

                this._domEvents(bemDom.doc).on('pointerdown', function(e) {
                    var target = $(e.target),
                        insideCalendar = dom.contains(this._calendar.domElem, target);

                    if(!insideCalendar && e.target !== this._elem('calendar').domElem[0]) {
                        this._needShowCalendar = true;
                    }

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

                if(!this._needShowCalendar) {
                    this._needShowCalendar = true;
                    return;
                }

                if(this._calendar.isShown()) return;

                this._showCalendar();
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
    _showCalendar: function() {
        this._calendar
            .setVal(this.getVal())
            .show();

        return this;
    },
    _onPointerclick: function(e) {
        this.__base.apply(this, arguments);

        if(this.hasMod('disabled') || this._calendar.isShown()) return;

        if(e.target === this._elem('calendar').domElem[0]) {
            this._needShowCalendar = true;
            return;
        }

        this._showCalendar();
    },
    _onCalendarClick: function() {
        this
            .setMod('focused')
            ._needShowCalendar = false;
    }
}, {
    onInit: function() {
        this._domEvents().on('pointerclick', this.prototype._onPointerclick);
        this._domEvents('calendar').on('pointerclick', this.prototype._onCalendarClick);

        this.__base.apply(this, arguments);
    }
}));

});
