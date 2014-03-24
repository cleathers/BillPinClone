BillPinClone.Views.ShowSplit = Backbone.View.extend({
  
  initialize: function (options) {
    this.listenTo(this.model, 'sync', this.render);
  },

  template: JST['show_split'],

  render: function () {
    var view = this;

    debugger
    var renderedContent = view.template({
      split: view.model.attributes.split,
      users: view.model.attributes.users
    });

    view.$el.html(renderedContent);
    return view;
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
  }

});
