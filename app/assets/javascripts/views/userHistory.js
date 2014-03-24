BillPinClone.Views.UserHistory = Backbone.View.extend({
  initialize: function (options) {
    BillPinClone.splits.fetch();
    this.histories = options['history'];
    this.friend_id = options['friend_id'];

    this.listenTo(BillPinClone.splits, 'sync add', this.render);
    this.listenTo(this.histories, 'sync', this.render);
  },

  events: {
    'click tr': 'routeToSplit'
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

//    var splits = BillPinClone.splits.filter(function (split) {
//      if ((split.get('user_id') == BillPinClone.current_user.id &&
//          split.get('friend_id') == view.friend_id)) {
//        return split
//      }
//    });

    var splits = [];
    BillPinClone.splits.each(function (split) {
      var posSplits = split.attributes.pos_splits,
          negSplits = split.attributes.neg_splits;

      _.each(posSplits, function (split) {
        splits.push(split);
      });
      _.each(negSplits, function (split) {
        splits.push(split);
      });
    });

    splits = _.sortBy(splits, function (split) {
      return split['created_at'];
    });

    view.setTotal(splits);
    return splits;
  },

  setTotal: function (splits) {
    var view = this;
    this._totalOwed = 0;
    splits.forEach(function (split) {
      debugger
      if (split['friend_id'] == BillPinClone.current_user.id) {

        view._totalOwed += parseInt(split['amt']);

      } else {

        view._totalOwed -= parseInt(split['amt']);
      }
    });
  },

  routeToSplit: function (event) {
    debugger
    if (event.currentTarget.dataset.splitId) {
      var route = 'split/' + event.currentTarget.dataset.splitId;
      Backbone.history.navigate(route, {trigger: true});
    }
  }
  
});
