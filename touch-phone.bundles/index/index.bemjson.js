({
    block: 'page',
    mods: {
        theme: 'islands'
    },
    title: 'Datepicker',
    styles: [
        { elem: 'css', url: '_index.css' },
        '<!--[if IE]>',
            { elem: 'css', url: '_index.ie.css' },
        '<![endif]-->',
        '<!--[if IE 8]>',
            { elem: 'css', url: '_index.ie8.css' },
        '<![endif]-->',
        '<!--[if IE 9]>',
            { elem: 'css', url: '_index.ie9.css' },
        '<![endif]-->'
    ],
    scripts: [
        { elem: 'js', url: '_index.js' }
    ],
    content: [
        {
            attrs: {
                style: 'padding: 100px'
            },
            content: {
                block: 'input',
                mods: {
                    theme: 'islands',
                    size: 'm',
                    'has-calendar': true
                },
                weekdays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
                months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
            }
        }
    ]
});
