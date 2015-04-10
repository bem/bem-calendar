BEM.DOM.decl({ name: 'input', modName: 'has-calendar', modVal: 'yes' }, {
    onSetMod: {
        js: function(){
            this.__base.apply(this, arguments);

            this.__self._checkNativeDatepicker() && this._initIosNativeCalendar();

            (parseInt(BEM.blocks['i-ua'].wp, 10) < 8) && this._initWP7Calendar();
        },
        focused: function() {
            // В базовом методе выставляется фокус на инпут. Это ломает нативный календарь.
            // В этом случае не используем базовый метод, а только показ/скрытие хинта из него.
            this.__self._checkNativeDatepicker()
                ? this._updateHint()
                : this.__base.apply(this, arguments);
        }
    },

    _initWP7Calendar: function() {
        this._cancelFocus = true;
        this.setMod(this.elem('calendar'), 'wp7', 'yes');
    },

    _initIosNativeCalendar: function() {

        this.unbindFrom('control', 'leftclick.calendar');
        this.unbindFrom('calendar', 'leftclick.calendar');

        this.domElem.append($('<input class="input__ios-calendar" type="date"/>'));

        // Higlight input
        this.bindTo('ios-calendar', 'focus blur', function(e) {
            this.setMod('focused', e.type === 'focus' ? 'yes' : '');
        });

        // Forwarding date to base input
        this.bindTo('ios-calendar', 'change', function() {
            this.val(this.elem('ios-calendar').val().split('-').reverse().join('.'));
            this._updateHint();
        });
    },
    _popupBEMJSON: function() {
        return {
            block: 'popup',
            mods: { theme: 'ffffff', adaptive: 'yes' },
            mix: this.params.popupMix,
            js: {
                directions: [
                    {
                        to: 'bottom',
                        axis:'left',
                        offset: { right: 10 }
                    },
                    {
                        to: 'top',
                        axis:'left',
                        offset: { right: 10 }
                    },
                    'bottom',
                    'top',
                    {
                        to: 'bottom',
                        axis:'right',
                        offset: { left: 10 }
                    },
                    {
                        to: 'top',
                        axis:'right',
                        offset: { left: 10 }
                    }]
            },
            content: [
                { elem: 'tail' },
                { elem: 'content' }
            ]
        };
    }
},
{
    _checkNativeDatepicker: function() {
        var ua = BEM.blocks['i-ua'],
            isSupport = false;

        if (typeof this._isNativeDateSupport === 'undefined') {
            try {
                isSupport = $("<input>").prop('type', 'date').prop('type') === 'date'
                    && (ua.ios > '5' || (ua.android && ua.chrome > '20') || ua.opera > '15');
            } catch (err) {}

            this._isNativeDateSupport = isSupport;
        }

        return this._isNativeDateSupport;
    }
});
