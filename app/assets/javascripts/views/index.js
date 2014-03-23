BillPinClone.Views.Index = Backbone.CompositeView.extend({
  
  initialize: function (options) {
    // creates a friend summaries view for the index
    this.friendSummaries = new BillPinClone.Views.FriendSummaries();
    this.addSubview('#content', this.friendSummaries);

    this.listenTo(BillPinClone.splits, 'sync', this.render);
  },

  events: {
    'click .quick-form button': 'swapContentView',
    'keyup #split-amt': 'handleKeyup',
    'keyup #split-des': 'handleKeyup'
  },

  template: JST['index'],

  handleKeyup: function (event) {
    if (this._subviews['#content'][0].el.id == 'full-form') {
      this._subviews['#content'][0].renderPrev(event);
    }
  },

  swapContentView: function (event) {
    event.preventDefault();
    var view = this;
    var splitVal = $('#split-amt').val();
    var splitDes = $('#split-des').val();

    // removes current content view adds new one
    // renders new views then changes button value
    if (this._subviews['#content'][0] == this.friendSummaries) {
      this.removeSubview('#content', this.friendSummaries);
      this.fullForm = new BillPinClone.Views.FullForm();
      this.addSubview('#content', this.fullForm);
      // re renders the subviews, then changes button text
      view.renderSubviews();
      $('#split-amt').val(splitVal);
      $('#split-des').val(splitDes);
      $('.quick-form button').html('CANCEL ▴');
    } else if (this._subviews['#content'][0] == this.fullForm) {
      this.removeSubview('#content', this.fullForm);
      this.friendSummaries = new BillPinClone.Views.FriendSummaries();
      this.addSubview('#content', this.friendSummaries);
      view.renderSubviews();
      $('.quick-form button').html('SPLIT IT ▾');
    }

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
