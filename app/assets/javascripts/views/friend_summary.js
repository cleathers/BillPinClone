BillPinClone.Views.FriendSummaries = Backbone.View.extend({

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
      splits: BillPinClone.splits
    });

    view.$el.html(renderedContent);
    return view;
  }
});
