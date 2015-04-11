# Островной календарь на O2

Портирован из [web4](https://github.yandex-team.ru/serp/web4/tree/dev/contribs/calendar).

Desktop:<br/>
![calendar](https://github.yandex-team.ru/seles/o2-calendar/raw/master/preview/desktop.png)


## Пример подключения
```js
{
    block: 'input',
    js: {
        weekdays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    },
    mods: {
        'has-calendar': true,
        size: 'm',
        theme: 'islands',
        readonly: true
    }
}
```
