/**
 * @module calendar
 */
modules.define('calendar', ['i-bem-dom', 'BEMHTML', 'jquery', 'select'], function(provide, bemDom, BEMHTML, $, Select, Calendar) {

  function compareMonths(a, b) {
      return (a.getFullYear() - b.getFullYear()) * 100 + a.getMonth() - b.getMonth();
  }

  /**
   * @exports
   * @class Calendar
   * @bem
   */
  provide(Calendar.declMod({ modName: 'nav', modVal: 'select' }, /** @lends calendar.prototype */{

      /**
       * Switch month
       *
       * @param {Number} month - Months
       * @returns {calendar} this
       */
      switchMonth: function(month) {
          this._month.setMonth(month);

          this._nextTick(this._build);

          return this;
      },

      /**
       * Switch year
       *
       * @param {Number} year - Year
       * @returns {calendar} this
       */
      switchYear: function(year) {
          this._month.setFullYear(year);

          while (!this._isValidDate(this._month)) {
              var month     = this._month.getMonth(),
                  prevMonth = compareMonths(this._month, this._earlierLimit) > 0,
                  nextMonth = compareMonths(this._laterLimit, this._month) > 0;

              if(!prevMonth) {
                  this._month.setMonth(month + 1);
              } else if(!nextMonth) {
                  this._month.setMonth(month - 1);
              }
          }

          this._nextTick(this._build);

          return this;
      },

      _buildTitle: function(month) {
          var curYear   = month.getFullYear(),
              firstYear = this._earlierLimit ? this._earlierLimit.getFullYear() : curYear - 10,
              lastYear  = this._laterLimit ? this._laterLimit.getFullYear() : curYear + 10,
              months    = [],
              years     = [];

          this.params.months.forEach(function(el, i) {
              var date = this.parseDate('1.' + (i + 1) + '.' + curYear);
              months.push({ val: i, text: el, disabled: !this._isValidDate(date) });
          }, this);

          for(var i = firstYear; i <= lastYear; i++) {
              years.push({ val: i, text: i });
          }

          return {
              elem: 'title',
              content: [
                  {
                      block: 'select',
                      mods: {
                          mode: 'radio',
                          theme: this.getMod('theme'),
                          size: this.getMod('select-size')
                      },
                      mix: { block: 'calendar', elem: 'month' },
                      name: 'month',
                      val: month.getMonth(),
                      options: months
                  },
                  {
                      block: 'select',
                      mods: {
                          mode: 'radio',
                          theme: this.getMod('theme'),
                          size: this.getMod('select-size'),
                          disabled: !(years.length > 1)
                      },
                      mix: { block: 'calendar', elem: 'year' },
                      name: 'year',
                      val: curYear,
                      options: years
                  }
              ]
          };
      },

      _onSelectChange: function(e) {
          var select = e.bemTarget,
              val    = select.getVal();

          switch (select.getName()) {
              case 'month':
                this.switchMonth(val);
                break;
              case 'year':
                this.switchYear(val);
                break;
          }
      }
  },  /** @lends calendar */ {
      lazyInit: false,

      onInit: function() {
          this.__base.apply(this, arguments);
          this._events(Select).on('change', this.prototype._onSelectChange);
      }
  }));

  });
