[
    {
        mustDeps: {
            block: 'i-bem-dom'
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
    },
    {
        tech: 'js',
        shouldDeps: {
            tech: 'bemhtml'
        }
    }
];
