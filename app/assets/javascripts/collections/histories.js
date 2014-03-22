BillPinClone.Collections.Histories = Backbone.Collection.extend({
  url: '/api/histories',
  model: BillPinClone.Models.History,

  getOrFetch: function (id) {
    var model;
    var histories = this;

    if (model = this.get(id)) {
      return model;
    } else {
      model = new BillPinClone.Models.History({ id: id });
      model.fetch({
        success: function () { histories.add(model) }
      });
      return model;
    }
  }
});
