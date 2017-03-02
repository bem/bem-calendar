/**
 * @module input
 */
modules.define('input', ['i-bem-dom', 'jquery', 'dom', 'calendar', 'popup'], function(provide, bemDom, $, dom, Calendar, Popup, Input) {

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

                this._popup = this.findChildBlock(Popup);
                this.setAnchor(this.domElem);

                this._calendar = this.findChildBlock(Calendar)
                    .setVal(this.getVal());

                this._shouldShowCalendar = false;
                this._events(this._calendar).on('change', function(e, data) {
                    this._needShowCalendar = false;

                    this
                        .setVal(data.formated)
                        .setMod('focused');
                    this.hide();
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

                if(this.isShown()) return;

                this.show();
            },
            '': function() {
                this.__base.apply(this, arguments);

                if(this._ignoreBlur) {
                    this._ignoreBlur = false;
                } else {
                    this.hide();
                }
            }
        }
    },
    _onPointerclick: function(e) {
        this.__base.apply(this, arguments);

        if(this.hasMod('disabled') || this.isShown()) return;

        if(e.target === this._elem('calendar').domElem[0]) {
            this._needShowCalendar = true;
            return;
        }

        this.show();
    },
    _onCalendarClick: function() {
        if(this.isShown()) {
            this.hide();
        } else {
            this._calendar
                .setVal(this.getVal());
            this.show();
        }
    },
    /**
     * Is calendar shown?
     *
     * @returns {boolean}
     */
    isShown: function() {
        return this._popup.hasMod('visible');
    },

    /**
     * Set target
     *
     * @param {jQuery|Function} anchor - DOM elem or anchor Bem block.
     * @returns {input} this
     */
    setAnchor: function(anchor) {
        this._popup.setAnchor(anchor);
        return this;
    },

    /**
     * Show calendar
     *
     * @returns {input} this
     */
    show: function() {
        this._calendar._build();
        this._popup.setMod('visible', true);

        return this;
    },

    /**
     * Hide calendar
     *
     * @returns {input} this
     */
    hide: function() {
        this._popup.delMod('visible');

        return this;
    },

    /**
     * Sets directions for calendar.
     *
     * @param {Array<String>} directions - @see Popup.directions
     * @returns {input} this
     */
    setDirections: function(directions) {
        this._popup.params.directions = directions;
        return this;
    }
}, {
    onInit: function() {
        this._domEvents().on('pointerclick', this.prototype._onPointerclick);
        this._domEvents('calendar').on('pointerclick', this.prototype._onCalendarClick);

        this.__base.apply(this, arguments);
    }
}));

});
