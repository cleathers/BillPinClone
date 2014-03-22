BillPinClone.Views.ShowSplit = Backbone.View.extend({
  
  initialize: function (options) {
    this.split_id = options['split_id'];
    this.history = options['history'];
  },

  template: JST['show_split'],

  render: function () {
    var userSplits = this.getSplits();
    var total = this.calcTotal(userSplits);
    var payer = BillPinClone.friends.get(this.getPayer(userSplits).get('user_id'));

    debugger

    var renderedContent = this.template({
      user_splits: userSplits,
      history: this.history.get(userSplits[0].attributes['split_id']),
      total: total,
      payer: payer
    });

    this.$el.html(renderedContent);
    return this;
  },


  calcTotal: function (userSplits) {
    var total = 0;
    _.each(userSplits, function (split) {
      total += parseInt(split.get('amt'));
    });
    return total; 
  },

  getPayer: function (userSplits) {
    var payer = _.find(userSplits, function (split) {
          if (split.get('split_type') == 'positive') {
            return split;
          }
        });
    return payer;
  },


  getSplits: function () {
    var view = this;
    var splits = BillPinClone.splits.filter( function (split) {
      if (split.get('split_id') ==  view.split_id) {
        return split;
      } 
    });
    return splits;
  }
});
