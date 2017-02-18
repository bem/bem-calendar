({
    mustDeps: {
        block: 'i-bem-dom'
    },
    shouldDeps: [
        {
            elems: ['arrow', 'day', 'dayname']
        },
        {
            mods: { theme: 'islands', format: 'north-american' }
        },
        {
            block: 'popup',
            mods: {
                theme: 'islands',
                target: 'anchor'
            }
        }
    ]
});
