window.BillPinClone = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    console.log('Backbone on');
    BillPinClone.splits = new BillPinClone.Collections.Splits();
    new BillPinClone.Routers.AppRouter({
      $rootEl: $("#content")
    });
    Backbone.history.start();
  }
};
