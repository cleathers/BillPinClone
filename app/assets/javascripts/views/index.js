BillPinClone.Views.Index = Backbone.View.extend({
  
  initialize: function (options) {
    this.listenTo(this.collection, 'sync', this.render);
  },

  template: JST['index'],

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
    return view;
  }
});
