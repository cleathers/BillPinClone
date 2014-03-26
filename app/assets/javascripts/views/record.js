BillPinClone.Views.RecordPayment = Backbone.View.extend({
  
  template: JST['record_payment'],

  render: function () {
    this.$el.html(this.template({
      users: BillPinClone.friends,
      current_user: BillPinClone.current_user
    }));

    return this;
  }

});
