BillPinClone.Views.UserHistory = Backbone.View.extend({
  initialize: function (options) {
    BillPinClone.splits.fetch();
    this.histories = options['history'];
    this.friend_id = options['friend_id'];

    this.listenTo(BillPinClone.splits, 'sync add', this.render);
    this.listenTo(this.histories, 'sync', this.render);
  },

  template: JST['user_histories'],

  render: function () {
    var view = this;

    var splits = this.getSplits();
    var renderedContent = view.template({
      splits: splits,
      histories: view.histories,
      friend: BillPinClone.friends.get(view.friend_id),
      total: view._totalOwed
    });

    view.$el.html(renderedContent);
    return view;
  },


  getSplits: function () {
    var view = this;

    var splits = BillPinClone.splits.filter(function (split) {
      if ((split.get('user_id') == BillPinClone.current_user.id &&
          split.get('friend_id') == view.friend_id)) {
        return split
      }
    });
    view.setTotal(splits);
    return splits;
  },

  setTotal: function (splits) {
    var view = this;
    this._totalOwed = 0;
    splits.forEach(function (split) {
      debugger
      if (split.get('split_type') == 'positive') {

        view._totalOwed += parseInt(split.get('amt'));

      } else if (split.get('split_type') == 'negative') {

        view._totalOwed -= parseInt(split.get('amt'));
      }
    });
  }
  
});
