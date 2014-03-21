BillPinClone.Views.FriendSummaries = Backbone.View.extend({

  initialize: function (options) {
    this.listenTo(BillPinClone.splits, 'add', this.render);
  },

  template: JST['friend_summaries'],

  render: function () {
    var view = this;

    var positives = {},
        negatives = {};


  
    // Goes through all bill splits. Adds up totals  
    BillPinClone.splits.each(function (split) {
      var friend_id = split.get('friend_id');
      var user_id = split.get('user_id');

      if (split.get('split_type') == 'positive' &&
          friend_id == BillPinClone.current_user.get('id')){

        if (negatives[split.get('user_id')]) {
         negatives[split.get('user_id')] += parseInt(split.get('amt'))
        } else {
         negatives[split.get('user_id')] = parseInt(split.get('amt'))
        }

      } else if (split.get('split_type') == 'negative' &&
                  friend_id == BillPinClone.current_user.get('id')){

        if (positives[split.get('user_id')]) {
         positives[split.get('user_id')] += parseInt(split.get('amt'))
        } else {
         positives[split.get('user_id')] = parseInt(split.get('amt'))
        }

     // } else if (split.get('split_type') == 'positive' &&
     //          split.get('user_id') == BillPinClone.current_user.get('id')){
     //   positives.push(split);
      }

      // if a user is in both positives and negatives hash, this will subtract
      // the difference and remove the key from the other hash.
      if (positives[user_id] && negatives[user_id]) {
        if (positives[user_id] > negatives[user_id]) {
          positives[user_id] -= negatives[user_id]
          delete negatives[user_id]

        } else if (positives[user_id] < negatives[user_id]) {
          negatives[user_id] -= positives[user_id]
          delete positives[user_id]

        } else {
          delete negatives[user_id];
          delete positives[user_id];
        }
      }
      
    });

    
    var renderedContent = view.template({
      positives: positives,
      negatives: negatives,
      splits: BillPinClone.splits,
      users: BillPinClone.friends
    });

    view.$el.html(renderedContent);
    return view;
  }
});
