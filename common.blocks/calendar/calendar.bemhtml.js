block('calendar').mix()(function() {
    return {
        block: 'popup',
        mods: {
            'has-calendar': true,
            target: 'anchor',
            theme: this.mods.theme
        }
    };
});
