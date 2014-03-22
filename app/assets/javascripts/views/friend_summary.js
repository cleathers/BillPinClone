BillPinClone.Views.FriendSummaries = Backbone.View.extend({

  initialize: function (options) {
    this.listenTo(BillPinClone.splits, 'sync add', this.render);
    this.positives = {};
    this.negatives = {};
  },

  events: {
    'click tr': 'routeToUser'
  },

  template: JST['friend_summaries'],


  render: function () {
    var view = this;
    this.posOrNeg();
    
    var renderedContent = view.template({
      positives: view.positives,
      posSum: view.posSum(),
      negatives: view.negatives,
      negSum: view.negSum(),
      splits: BillPinClone.splits,
      users: BillPinClone.friends
    });

    view.$el.html(renderedContent);
    return view;
  },

  posSum: function () {
    var sum = 0;
    _.values(this.positives).forEach(function (num) {
      sum += parseInt(num);
    });
    return sum;
  },

  negSum: function () {
    var sum = 0;
    _.values(this.negatives).forEach(function (num) {
      sum += parseInt(num);
    });
    return sum;
  },

  posOrNeg: function () {
    var view = this;
    this.positives = {};
    this.negatives = {};

    // Goes through all bill splits. Adds up totals  
    BillPinClone.splits.each(function (split) {
      var friend_id = split.get('friend_id');
      var user_id = split.get('user_id');

      

      if (split.get('split_type') == 'positive' &&
          friend_id == BillPinClone.current_user.get('id')){

        if (view.negatives[split.get('user_id')]) {
         view.negatives[split.get('user_id')] += parseInt(split.get('amt'))
        } else {
         view.negatives[split.get('user_id')] = parseInt(split.get('amt'))
        }

      } else if (split.get('split_type') == 'negative' &&
                  friend_id == BillPinClone.current_user.get('id')){

        if (view.positives[split.get('user_id')]) {
         view.positives[split.get('user_id')] += parseInt(split.get('amt'))
        } else {
         view.positives[split.get('user_id')] = parseInt(split.get('amt'))
        }

     // } else if (split.get('split_type') == 'positive' &&
     //          split.get('user_id') == BillPinClone.current_user.get('id')){
     //   positives.push(split);
      }

      // if a user is in both positives and negatives hash, this will subtract
      // the difference and remove the key from the other hash.
      if (view.positives[user_id] && view.negatives[user_id]) {
        if (view.positives[user_id] > view.negatives[user_id]) {
          view.positives[user_id] -= view.negatives[user_id]
          delete view.negatives[user_id]

        } else if (view.positives[user_id] < view.negatives[user_id]) {
          view.negatives[user_id] -= view.positives[user_id]
          delete view.positives[user_id]
        } else {
          delete view.negatives[user_id];
          delete view.positives[user_id];
        }
      }
    });
  },

  routeToUser: function (event) {
    if (event.currentTarget.dataset.userId) {
      var route = 'user/' + event.currentTarget.dataset.userId;
      Backbone.history.navigate(route, {trigger: true});
    }
  }

});
