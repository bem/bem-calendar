({
    mustDeps: {
        block: 'i-bem',
        elems: 'dom'
    },
    shouldDeps: [
        {
            elems: ['arrow', 'day', 'dayname']
        },
        {
            mods: { theme: 'islands' }
        },
        {
            block: 'popup',
            mods: {
                theme: 'islands',
                target: 'anchor'
            }
        }
    ]
})
