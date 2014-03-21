BillPinClone.Views.FriendSummaries = Backbone.View.extend({

  initialize: function (options) {
    this.listenTo(BillPinClone.splits, 'add', this.render);
  },

  template: JST['friend_summaries'],

  render: function () {
    var view = this;
    var positives = [],
        negatives = [];
    
    BillPinClone.splits.each(function (split) {
      debugger
      if (split.get('split_type') == 'positive' &&
              split.get('friend_id') == BillPinClone.current_user.get('id')){
        negatives.push(split);
      } else if (split.get('split_type') == 'negative' &&
              split.get('friend_id') == BillPinClone.current_user.get('id')){
        positives.push(split);  
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
