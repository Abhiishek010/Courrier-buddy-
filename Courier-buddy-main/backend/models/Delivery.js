const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
{
    productName: {
        type: String,
        required: true
    },
    ecommerceCompany: {
        type: String,
        required: true
    },
    accepterName: {
  type: String,
  default: ""
},
accepterPhone: {
  type: String,
  default: ""
},
accepterProfile: {
  type: String,
  default: ""
},
ownerName: {
  type: String,
  default: ""
},
ownerPhone: {
  type: String,
  default: ""
},
ownerProfile: {
  type: String,
  default: ""
},


deliveryAgentName: {
  type: String,
  default: ""
},
deliveryAgentPhone: {
  type: String,
  default: ""
},
parcelReceiverName: {
  type: String,
  default: ""
},

    pickupLocation: {
        type: String,
        required: true
    },
    hostelName: {
        type: String,
        required: true
    },
    rewardAmount: {
        type: Number,
        required: true
    },
    status: {
  type: String,
  enum: ["pending", "accepted", "delivered", "not_delivered","cancelled"],
  default: "pending"
},
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },

    accepterPhone: {
  type: String,
  default: "",
},

accepterName: {
  type: String,
  default: "",
},

accepterProfile: {
  type: String,
  default: "",
},

},
{ timestamps: true }
);

module.exports = mongoose.model("Delivery", deliverySchema);
