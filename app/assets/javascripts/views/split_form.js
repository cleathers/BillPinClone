BillPinClone.Views.SplitForm = Backbone.CompositeView.extend({

  attributes: {
    'id': 'split-form'
  },

  template: JST['splitForm'],


  render: function () {
    this.$el.html(this.template({
      users: BillPinClone.friends
    }));
    this.renderSubviews();
    return this;
  }

});
