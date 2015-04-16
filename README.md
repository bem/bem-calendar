# Календарь на O2

Портирован из [web4](https://github.yandex-team.ru/serp/web4/tree/dev/contribs/calendar).

![calendar](https://github.yandex-team.ru/seles/o2-calendar/raw/master/preview/desktop.png)
<br/>
На iOS и Android используется системный календарь.

## Пример использования

Вместе с `input`:
```js
{
    block: 'input',
    mods: {
        'has-calendar': true,
        size: 'm',
        theme: 'islands',
        readonly: true
    },
    weekdays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
    months: ['Январь', 'Февраль', 'Март',
        'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь',
        'Октябрь', 'Ноябрь', 'Декабрь'],
    val: '11.11.2015'
}
```

Как отдельный блок:
```js
{
    block: 'calendar',
    js: {
        weekdays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
        months: ['Январь', 'Февраль', 'Март',
            'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь',
            'Октябрь', 'Ноябрь', 'Декабрь'],
    },
    mods: {
        theme: 'islands'
    }
}
```
