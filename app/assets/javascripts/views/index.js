BillPinClone.Views.Index = Backbone.CompositeView.extend({
  
  initialize: function (options) {
    // creates a friend summaries view for the index
    this.friendSummaries = new BillPinClone.Views.FriendSummaries();
    this.addSubview('#content', this.friendSummaries);

    this.listenTo(BillPinClone.splits, 'sync', this.render);
  },

  events: {
    'click .quick-form button': 'swapContentView'
  },

  template: JST['index'],

  swapContentView: function (event) {
    event.preventDefault();
    debugger
    // removes friends summary add full form view
    if (this._subviews['#content'][0] == this.friendSummaries) {
      this.removeSubview('#content', this.friendSummaries);
      this.fullForm = new BillPinClone.Views.FullForm();
      this.addSubview('#content', this.fullForm);
    } else if (this._subviews['#content'][0] == this.fullForm) {
      this.removeSubview('#content', this.fullForm);
      this.friendSummaries = new BillPinClone.Views.FriendSummaries();
      this.addSubview('#content', this.friendSummaries);
    }

    // need to add a FullForm view to the page
    this.render();
  },

  render: function () {
    var view = this;
    var positives = [],
        negatives = [];
    
    BillPinClone.splits.each(function(split) {
                (split.amt >= 0) ? positives.push(split) : negatives.push(split); 
    });

    var renderedContent = view.template({
      positives: positives,
      negatives: negatives,
      splits: this.collection
    });

    view.$el.html(renderedContent);
    view.renderSubviews();
    return view;
  }
});
