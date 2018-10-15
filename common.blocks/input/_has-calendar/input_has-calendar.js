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
    beforeSetMod: {
        focused: {
            '': function() {
                this.__base.apply(this, arguments);

                if(this._ignoreBlur) {
                    this._ignoreBlur = false;
                    return false;
                }
            }
        }
    },
    onSetMod: {
        js: {
            inited: function() {
                this.__base.apply(this, arguments);

                this._popup = this.findChildBlock(Popup);
                this._setAnchor(this.domElem);

                this._calendar = this.findChildBlock(Calendar)
                    .setVal(this.getVal());

                this._events(this._calendar).on('change', function(e, data) {
                    this
                        .setVal(data.formated)
                        .hideCalendar();
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

                this._domEvents().on('pointerclick', this._onPointerclick);
                this._domEvents(bemDom.doc).on('pointerdown', this._onOutsideClick);

                if(this._wasIconCliked) {
                    this._wasIconCliked = false;

                    this._wasShown ?
                        this.hideCalendar() :
                        this.showCalendar();

                } else {
                    this.isCalendarShown() || this.showCalendar();
                }
            },
            '': function() {
                this.__base.apply(this, arguments);

                this._domEvents().un('pointerclick', this._onPointerclick);
                this._domEvents(bemDom.doc).un('pointerdown', this._onOutsideClick);

                this.hideCalendar();
            }
        }
    },
    _onOutsideClick: function(e) {
        var target = $(e.target),
            isInsideCalendar = dom.contains(this._popup.domElem, target);

        this._wasShown = e.target === this._elem('calendar').domElem[0] && this.isCalendarShown();

        this._ignoreBlur = isInsideCalendar;

        isInsideCalendar || this.delMod('focused');

    },
    _onPointerclick: function() {
        this.__base.apply(this, arguments);

        if(this.hasMod('disabled')) return;

        this.showCalendar();
    },
    _onCalendarIconClick: function() {
        this._wasIconCliked = true;
        this.setMod('focused');
    },
    /**
     * Is calendar shown?
     *
     * @returns {boolean}
     */
    isCalendarShown: function() {
        return this._popup.hasMod('visible');
    },

    /**
     * Set target
     *
     * @param {jQuery|Function} anchor - DOM elem or anchor Bem block.
     * @returns {input} this
     */
    _setAnchor: function(anchor) {
        this._popup.setAnchor(anchor);
        return this;
    },

    /**
     * Show calendar
     *
     * @returns {input} this
     */
    showCalendar: function() {
        this._calendar._build();
        this._popup.setMod('visible');

        return this;
    },

    /**
     * Hide calendar
     *
     * @returns {input} this
     */
    hideCalendar: function() {
        this._popup.delMod('visible');

        return this;
    },

    /**
     * Sets directions for calendar.
     *
     * @param {Array<String>} directions - @see Popup.directions
     * @returns {input} this
     */
    setCalendarDirections: function(directions) {
        this._popup.params.directions = directions;
        return this;
    }
}, {
    onInit: function() {
        this._domEvents('calendar').on('click', this.prototype._onCalendarIconClick);

        this.__base.apply(this, arguments);
    }
}));

});
