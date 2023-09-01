var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Competence = Schema(
  {
    _id:String,
    name: String,
    quarter: Number,

    program: [
      {
        ref: "Formation_programs",
        type: mongoose.Schema.Types.Number,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Competences", Competence);
