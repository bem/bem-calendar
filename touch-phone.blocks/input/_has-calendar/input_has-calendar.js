/**
 * @module input
 */
modules.define('input', ['i-bem-dom', 'jquery', 'ua'], function(provide, bemDom, $, ua, Input) {

/**
 * @exports
 * @class input
 * @augments control
 * @bem
 */
provide(Input.declMod({ modName: 'has-calendar', modVal: 'true' }, /** @lends input.prototype */{
    onSetMod: {
        js: function() {
            this.__base.apply(this, arguments);

            if(this.__self._checkNativeDatepicker()) {
                this._initIosNativeCalendar();
            } else {
                this._calendar.setDirections([
                    'bottom-left',
                    'top-left',
                    'bottom',
                    'top',
                    'bottom-right',
                    'top-right'
                ]);
            }

            (parseInt(ua.wp, 10) < 8) && this._initWP7Calendar();
        }
    },

    _initWP7Calendar: function() {
        this._elem('calendar').setMod('wp7', true);
    },

    _initIosNativeCalendar: function() {
        this._domEvents(bemDom.doc).un('pointerdown');
        this._domEvents('control').un('pointerclick blur focus');
        this._domEvents('calendar').un('pointerclick');

        this.domElem.append($('<input class="input__ios-calendar" type="date" value=""/>'));

        // Forwarding date to base input
        this._domEvents('ios-calendar').on('change', function() {
            var val = this._elem('ios-calendar').domElem.val().split('-').reverse().join('.');
            this.setVal(val);
        });
    }
},
{
    _checkNativeDatepicker: function() {
        var isSupport = false;

        if(typeof this._isNativeDateSupport === 'undefined') {
            try {
                isSupport = $('<input>').prop('type', 'date').prop('type') === 'date' &&
                    (ua.ios > '5' || (ua.android && ua.chrome > '20') || ua.opera > '15');
            } catch(e) {}

            this._isNativeDateSupport = isSupport;
        }

        return this._isNativeDateSupport;
    }
}));

});
