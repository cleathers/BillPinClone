BillPinClone.Routers.AppRouter = Backbone.Router.extend({

  initialize: function ( options ) {
    this.$rootEl = options['$rootEl'];
  },

  routes: {
    '': 'index',
    'history': 'history',
    'history/': 'history',
    'user/:id': 'userHistory',
    'user/:id/': 'userHistory',
    'split/:split_id': 'showSplit',
    'split/:split_id/': 'showSplit'
  },

  index: function() {
    var indexView = new BillPinClone.Views.Index();
    indexView.addSubview('#quickForm', new BillPinClone.Views.SplitForm());
    indexView.addSubview('#content', new BillPinClone.Views.FriendSummaries());
    this._swapViews(indexView);
  },

  history: function () {
    var that = this;
    var histories = new BillPinClone.Collections.Histories();
    histories.fetch({
      success: function (collection) {
        var historiesView = new BillPinClone.Views.Histories({history: collection});
        that._swapViews(historiesView);
      }
    });
  },

  showSplit: function (split_id) {
    var view = this;
    var histories = new BillPinClone.Collections.Histories();

    histories.fetch({
      success: function (collection) {
        var showSplitView = new BillPinClone.Views.ShowSplit({
          history: collection,
          split_id: split_id
        });
        view._swapViews(showSplitView);
      }
    });
  },

  userHistory: function (id) {
    var that = this;
    var histories = new BillPinClone.Collections.Histories();
    histories.fetch({
      success: function (collection) {
        var userView = new BillPinClone.Views.UserHistory({
          history: collection,
          friend_id: id   
        });
        that._swapViews(userView);
      }
    });
  },

  _swapViews: function(view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;
    this.$rootEl.html(view.render().$el);
  }

});
