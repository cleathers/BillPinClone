BillPinClone.Routers.AppRouter = Backbone.Router.extend({

  initialize: function ( options ) {
    this.$rootEl = options['$rootEl'];
  },

  routes: {
    '': 'index'
  },

  index: function() {
    var indexView = new BillPinClone.Views.Index({
      collection: BillPinClone.splits
    });

    this._swapViews(indexView);
  }
  


  _swapViews: function(view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;
    this.$rootEl.html(view.render().$el);
  }

});
