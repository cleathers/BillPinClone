window.BillPinClone = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    BillPinClone.splits = new BillPinClone.Collections.Splits();
    BillPinClone.splits.fetch({
      success: function () {
        new BillPinClone.Routers.AppRouter({
          $rootEl: $("#content")
        });
      Backbone.history.start();
      }
    });
  }
};
