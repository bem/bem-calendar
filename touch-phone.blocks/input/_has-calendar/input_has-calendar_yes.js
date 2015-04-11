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

            this.__self._checkNativeDatepicker() && this._initIosNativeCalendar();

            (parseInt(ua.wp, 10) < 8) && this._initWP7Calendar();
        },
        focused: function() {
            // В базовом методе выставляется фокус на инпут. Это ломает нативный календарь.
            // В этом случае не используем базовый метод, а только показ/скрытие хинта из него.
            this.__self._checkNativeDatepicker() || this.__base.apply(this, arguments);
        }
    },

    _initWP7Calendar: function() {
        this._cancelFocus = true;
        this.setMod(this.elem('calendar'), 'wp7', true);
    },

    _initIosNativeCalendar: function() {
        this.unbindFrom('control', 'pointerclick');
        this.unbindFrom('calendar', 'pointerclick');

        this.domElem.append($('<input class="input__ios-calendar" type="date"/>'));

        // Higlight input
        this.bindTo('ios-calendar', 'focus blur', function(e) {
            this.setMod('focused', e.type === 'focus');
        });

        // Forwarding date to base input
        this.bindTo('ios-calendar', 'change', function() {
            this.setVal(this.elem('ios-calendar').val().split('-').reverse().join('.'));
        });
    },
    _popupBEMJSON: function() {
        return {
            block: 'popup',
            mods : { theme: 'islands', target : 'anchor' },
            directions : [
                'bottom-left',
                'top-left',
                'bottom',
                'top',
                'bottom-right',
                'top-right'
            ]
        };
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
