import { PlusIcon, SquarePenIcon, Trash2Icon, XIcon } from "lucide-react";
import React, { useState } from "react";
import AddressModal from "./AddressModal";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteAddress } from "@/lib/features/address/addressSlice";

const OrderSummary = ({ totalPrice, items }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";
  const router = useRouter();
  const dispatch = useDispatch();
  const addressList = useSelector((state) => state.address.list);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [coupon, setCoupon] = useState("");

  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Delete this address?")) return;
    try {
      const res = await fetch("/api/address/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId }),
      });
      const data = await res.json();
      if (data.success) {
        dispatch(deleteAddress(addressId));
        toast.success("Address deleted!");
        if (selectedAddress?.id === addressId) setSelectedAddress(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleCouponCode = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(`/api/coupon/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCodeInput }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupon(data.coupon);
        toast.success("Coupon applied!");
      } else {
        toast.error(data.message || "Invalid coupon!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!selectedAddress) {
      toast.error("Please select an address!");
      return;
    }

    const orderItems = items.map((item) => ({
      productId: item.id,
      name: item.name,
      image: item.images[0],
      quantity: item.quantity,
      price: item.price,
      storeId: item.storeId,
    }));

    if (paymentMethod === "STRIPE") {
      try {
        const res = await fetch("/api/payment/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: orderItems,
            addressId: selectedAddress.id,
            coupon: coupon || null,
            total: coupon
              ? totalPrice - (coupon.discount / 100) * totalPrice
              : totalPrice,
          }),
        });
        const data = await res.json();
        if (data.success) {
          window.location.href = data.url; // Stripe checkout pe redirect
        } else {
          toast.error(data.message || "Something went wrong!");
        }
      } catch (error) {
        toast.error("Something went wrong!");
      }
    } else {
      // COD
      try {
        const res = await fetch("/api/order/place", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: orderItems,
            addressId: selectedAddress.id,
            paymentMethod,
            coupon: coupon || null,
            total: coupon
              ? totalPrice - (coupon.discount / 100) * totalPrice
              : totalPrice,
          }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Order placed successfully!");
          router.push("/orders");
        } else {
          toast.error(data.message || "Something went wrong!");
        }
      } catch (error) {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7">
      <h2 className="text-xl font-medium text-slate-600">Payment Summary</h2>
      <p className="text-slate-400 text-xs my-4">Payment Method</p>
      <div className="flex gap-2 items-center">
        <input type="radio" id="COD" onChange={() => setPaymentMethod("COD")} checked={paymentMethod === "COD"} className="accent-gray-500" />
        <label htmlFor="COD" className="cursor-pointer">COD</label>
      </div>
      <div className="flex gap-2 items-center mt-1">
        <input type="radio" id="STRIPE" name="payment" onChange={() => setPaymentMethod("STRIPE")} checked={paymentMethod === "STRIPE"} className="accent-gray-500" />
        <label htmlFor="STRIPE" className="cursor-pointer">Stripe Payment</label>
      </div>

      <div className="my-4 py-4 border-y border-slate-200 text-slate-400">
        <p>Address</p>
        {selectedAddress ? (
          <div className="flex gap-2 items-center">
            <p>{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</p>
            <SquarePenIcon onClick={() => setSelectedAddress(null)} className="cursor-pointer" size={18} />
          </div>
        ) : (
          <div>
            {addressList.length > 0 && (
              <div className="flex flex-col gap-2 my-3">
                {addressList.map((address, index) => (
                  <div key={index} className="flex items-center gap-2 border border-slate-200 rounded p-2">
                    <input type="radio" name="address" id={`addr-${index}`} onChange={() => setSelectedAddress(address)} className="accent-slate-600" />
                    <label htmlFor={`addr-${index}`} className="flex-1 cursor-pointer text-xs">
                      {address.name}, {address.city}, {address.state}, {address.zip}
                    </label>
                    <SquarePenIcon size={15} className="cursor-pointer hover:text-slate-800 transition" onClick={() => setEditAddress(address)} />
                    <Trash2Icon size={15} className="cursor-pointer hover:text-red-500 transition" onClick={() => handleDeleteAddress(address.id)} />
                  </div>
                ))}
              </div>
            )}
            <button className="flex items-center gap-1 text-slate-600 mt-1" onClick={() => setShowAddressModal(true)}>
              Add Address <PlusIcon size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="pb-4 border-b border-slate-200">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1 text-slate-400">
            <p>Subtotal:</p>
            <p>Shipping:</p>
            {coupon && <p>Coupon:</p>}
          </div>
          <div className="flex flex-col gap-1 font-medium text-right">
            <p>{currency}{totalPrice.toLocaleString()}</p>
            <p>Free</p>
            {coupon && <p>{`-${currency}${((coupon.discount / 100) * totalPrice).toFixed(2)}`}</p>}
          </div>
        </div>
        {!coupon ? (
          <form onSubmit={(e) => toast.promise(handleCouponCode(e), { loading: "Checking Coupon..." })} className="flex justify-center gap-3 mt-3">
            <input onChange={(e) => setCouponCodeInput(e.target.value)} value={couponCodeInput} type="text" placeholder="Coupon Code" className="border border-slate-400 p-1.5 rounded w-full outline-none" />
            <button className="bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all">Apply</button>
          </form>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 text-xs mt-2">
            <p>Code: <span className="font-semibold ml-1">{coupon.code.toUpperCase()}</span></p>
            <p>{coupon.description}</p>
            <XIcon size={18} onClick={() => setCoupon("")} className="hover:text-red-700 transition cursor-pointer" />
          </div>
        )}
      </div>

      <div className="flex justify-between py-4">
        <p>Total:</p>
        <p className="font-medium text-right">
          {currency}{coupon ? (totalPrice - (coupon.discount / 100) * totalPrice).toFixed(2) : totalPrice.toLocaleString()}
        </p>
      </div>

      <button onClick={(e) => toast.promise(handlePlaceOrder(e), { loading: "Placing Order..." })} className="w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all">
        Place Order
      </button>

      {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}
      {editAddress && <AddressModal setShowAddressModal={() => setEditAddress(null)} editAddress={editAddress} />}
    </div>
  );
};

export default OrderSummary;