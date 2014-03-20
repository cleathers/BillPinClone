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
      (split.amt >= 0) ? positives.push(split) : negatives.push(split);
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
