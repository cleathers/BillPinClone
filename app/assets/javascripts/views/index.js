BillPinClone.Views.Index = Backbone.View.extend({
  
  initialize: function (options) {
    this.listenTo(this.collection, 'sync', this.render);
  },

  template: JST['index'],

  render: function () {
    var view = this;
    var renderedContent = view.template({
      splits: this.collection
    });

    view.$el.html(renderedContent);
    return view;
  }
});
