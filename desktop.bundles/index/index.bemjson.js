({
    block: 'page',
    mods: {
        theme: 'islands'
    },
    title: 'Datepicker',
    styles: [
        { elem: 'css', url: 'index.min.css' },
        '<!--[if IE]>',
            { elem: 'css', url: 'index.ie.min.css' },
        '<![endif]-->',
        '<!--[if IE 8]>',
            { elem: 'css', url: 'index.ie8.min.css' },
        '<![endif]-->',
        '<!--[if IE 9]>',
            { elem: 'css', url: 'index.ie9.min.css' },
        '<![endif]-->'
    ],
    scripts: [
        { elem: 'js', url: 'index.min.js' }
    ],
    content: [
        {
            attrs: {
                style: 'padding: 100px'
            },
            content: [{
                block: 'input',
                mods: {
                    theme: 'islands',
                    size: 'm',
                    'has-calendar': true
                },
                weekdays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
                months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
            }]
        },
        {
            block:'calendar',
            mods:{
                theme:'islands'
            },
            js:{
                weekdays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
                months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
            }
        }
    ]
});
