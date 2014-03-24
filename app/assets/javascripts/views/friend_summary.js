BillPinClone.Views.FriendSummaries = Backbone.View.extend({

  initialize: function (options) {
    this.listenTo(BillPinClone.splits, 'sync add', this.render);
    this.positives = {};
    this.negatives = {};
  },

  events: {
    'click tr': 'routeToUser'
  },

  attributes: {
    'id': 'friend-summaries'
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

      var posSplits = split.attributes.pos_splits,
          negSplits = split.attributes.neg_splits;

      _.each(posSplits, function(posSplit) {
        if ( view.positives[posSplit['user_id']] ) {
          view.positives[posSplit['user_id']] += parseInt(posSplit['amt']);
        } else {
          view.positives[posSplit['user_id']] = parseInt(posSplit['amt']);
        }
      });

      _.each(negSplits, function(negSplit) {
        if ( view.negatives[negSplit['friend_id']] ) {
          view.negatives[negSplit['friend_id']] += parseInt(negSplit['amt']);
        } else {
          view.negatives[negSplit['friend_id']] = parseInt(negSplit['amt']);
        }
      });

        debugger
      // if a user is in both positives and negatives hash, this will subtract
      // the difference and remove the key from the other hash.
      _.each(view.positives, function (sum, user) {
        if (view.negatives[user]) {
          if (sum > view.negatives[user]) {
            view.positives[user] -= view.negatives[user];
            delete view.negatives[user];
          } else if (sum < view.negatives[user]) {
            view.negatives[user] -= view.positives[user];
            delete view.positives[user];
          } else {
            delete view.positives[user];
            delete view.negatives[user];
          }
        }
      });
    });
  },

  routeToUser: function (event) {
    if (event.currentTarget.dataset.userId) {
      var route = 'user/' + event.currentTarget.dataset.userId;
      Backbone.history.navigate(route, {trigger: true});
    }
  }

});
