BillPinClone.Views.Histories = Backbone.View.extend({
  initialize: function (options) {
    BillPinClone.splits.fetch();
    this.histories = options['history'];

    this.listenTo(BillPinClone.splits, 'sync add', this.render);
    this.listenTo(this.histories, 'sync', this.render);
  },

  template: JST['histories'],

  render: function () {
    var view = this;

    var splits = this.getSplits();

    var renderedContent = view.template({
      splits: splits,
      histories: view.histories
    });

    view.$el.html(renderedContent);
    return view;
  },

  getSplits: function () {
    var splits = BillPinClone.splits.filter(function (split) {
      if (split.get('user_id') == BillPinClone.current_user.id) {
        return split;
      }
    });
    return splits;
  }

});
