BillPinClone.Routers.AppRouter = Backbone.Router.extend({

  initialize: function ( options ) {
    this.$rootEl = options['$rootEl'];
  },

  routes: {
    '': 'index'
  },

  index: function() {
    console.log('in index');
    var indexView = new BillPinClone.Views.Index({
      collection: BillPinClone.splits

    });
    this._swapViews(indexView);
    var splitForm = new BillPinClone.Views.SplitForm({
      collection: BillPinClone.splits
    });
    this.$rootEl.append(splitForm.render().$el);
  },
  


  _swapViews: function(view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;
    this.$rootEl.html(view.render().$el);
  }

});
