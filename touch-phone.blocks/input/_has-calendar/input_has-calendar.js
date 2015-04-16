/**
 * @module input
 */
modules.define('input', ['i-bem__dom', 'jquery', 'ua'], function(provide, BEMDOM, $, ua) {

/**
 * @exports
 * @class input
 * @augments control
 * @bem
 */
provide(BEMDOM.decl({ block: this.name, modName: 'has-calendar' }, /** @lends input.prototype */{
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
        this.setMod(this.elem('calendar'), 'wp7', true);
    },

    _initIosNativeCalendar: function() {
        this.unbindFromDoc('pointerdown');
        this.unbindFrom('control', 'pointerclick blur focus');
        this.unbindFrom('calendar', 'pointerclick');

        this.domElem.append($('<input class="input__ios-calendar" type="date" value=""/>'));

        // Forwarding date to base input
        this.bindTo('ios-calendar', 'change', function() {
            var val = this.elem('ios-calendar').val().split('-').reverse().join('.');
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
