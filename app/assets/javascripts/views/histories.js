BillPinClone.Views.Histories = Backbone.View.extend({
  initialize: function (options) {
    BillPinClone.splits.fetch();
    this.histories = options['history'];

    this.listenTo(BillPinClone.splits, 'sync add', this.render);
    this.listenTo(this.histories, 'sync', this.render);
  },

  events: {
    'click tr': 'routeToSplit'
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

    return splits;
  },

  routeToSplit: function (event) {
    debugger
    if (event.currentTarget.dataset.splitId) {
      var route = 'split/' + event.currentTarget.dataset.splitId;
      Backbone.history.navigate(route, {trigger: true});
    }
  }

});
