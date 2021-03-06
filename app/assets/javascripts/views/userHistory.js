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
      total: view._totalOwed.toFixed(2)
    });

    view.$el.html(renderedContent);
    return view;
  },


  getSplits: function () {
    var view = this;

    var splits = [];
    BillPinClone.splits.each(function (split) {
      var posSplits = split.attributes.pos_splits,
          negSplits = split.attributes.neg_splits;

      debugger
      _.each(posSplits, function (split) {
        if (split['user_id'] == view.friend_id) {
          splits.push(split);
        }
      });
      _.each(negSplits, function (split) {
        if (split['friend_id'] == view.friend_id) {
          splits.push(split);
        }
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
    this._totalOwed = parseFloat('0.00');
    debugger
    splits.forEach(function (split) {
      if (split['user_id'] == view.friend_id) {
        view._totalOwed = parseFloat(view._totalOwed) + parseFloat(split['amt']);

      } else if (split['friend_id'] == BillPinClone.current_user.id) {
        view._totalOwed = parseFloat(view._totalOwed) - parseFloat(split['amt']);

      } else if (split['friend_id'] == view.friend_id) {
        view._totalOwed = parseFloat(view._totalOwed) - parseFloat(split['amt']);

      }
    });
  },

  routeToSplit: function (event) {
    if (event.currentTarget.dataset.splitId) {
      var route = 'split/' + event.currentTarget.dataset.splitId;
      Backbone.history.navigate(route, {trigger: true});
    }
  }
  
});
