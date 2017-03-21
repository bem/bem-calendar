block('calendar')(
    mix()(function() {
        var mix = { block: 'popup' };

        mix.mods = {
            'has-calendar': true,
            target: 'anchor',
            theme: this.mods.theme
        };

        return mix;
    })
);
