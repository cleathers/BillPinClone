BillPinClone.Collections.Splits = Backbone.Collection.extend({

  model: BillPinClone.Models.Split,
  url: '/api/splits',

  getOrFetch: function (id) {
    var model;
    var splits = this;

    if (model = this.get(id)) {
      return model;
    } else {
      model = new BillPinClone.Models.Split({ id: id });
      model.fetch({
        success: function () { splits.add(model) }
      });
      return model;
    }
  }

});
