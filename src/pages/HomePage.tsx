import TextField from "../components/TextField";
import applePayLogo from "../assets/Apple_Pay_Mark_RGB_041619.svg"
import googlePayLogo from "../assets/google-pay-mark_800.svg"
import { useContext, useEffect } from "react";
import { CheckoutDetailsContext } from "../context/CheckoutDetailsContext";
import Divider from "../components/Divider";
import { SettingsContext } from "../context/SettingContext";
import PaymentPageComponent from "./PaymentPageCompoent";
import GooglePayComponent from "./GooglePayComponent";
import JSSDKComponent from "./JSSDKComponent";
import PaymentGWComponent from "./PaymentGWComponent";
import PaymentS2SComponent from "./PaymentS2SComponent";
import { IPaymentMethod, PaymentMethodType } from "../models/enums";
import cardLogo from "../assets/icons8-debit-card-96.png"
import alipayLogo from "../assets/alipayplus.svg"
import { OutlinedSelectCard } from "../components/OutlinedSelectCard";
import AlipayComponent from "./AlipayComponent";
import ApplePayComponent from "./ApplePayComponent";

const paymentMethods: { [key in PaymentMethodType]: IPaymentMethod } = {
  BANKCARDJS: {
    displayName: "Credit Card (JS SDK)",
    imgSrc: cardLogo,
    terminalCode: "69911",
    password: "a15935712X",
    children: JSSDKComponent
  },
  BANKCARDPP: {
    displayName: "Credit Card (Payment Page)",
    imgSrc: cardLogo,
    terminalCode: "69711",
    password: "a15935712X",
    children: PaymentPageComponent
  },
  BANKCARDGW: {
    displayName: "Credit Card (Gateway)",
    terminalCode: "69911",
    password: "a15935712X",
    imgSrc: cardLogo,
    children: PaymentGWComponent
  },
  BANKCARDS2S: {
    displayName: "Credit Card (Server to Server)",
    terminalCode: "70029",
    password: "a15935712X",
    imgSrc: cardLogo,
    children: PaymentS2SComponent
  },
  APPLEPAY: {
    displayName: "Apple Pay",
    imgSrc: applePayLogo,
    terminalCode: "71189",
    password: "a15935712X",
    children: ApplePayComponent
  },
  GOOGLEPAY: {
    displayName: "Google Pay",
    imgSrc: googlePayLogo,
    terminalCode: "69911",
    password: "a15935712X",
    children: GooglePayComponent
  },
  // ALIPAYPLUS: {
  //   displayName: "Alipay+",
  //   imgSrc: alipayLogo,
  //   terminalCode: "69711",
  //   password: "a15935712X",
  //   children : AlipayComponent
  // }
};


export default function HomePage() {

  const settingContext = useContext(SettingsContext)

  const paymentMethod = paymentMethods[settingContext?.paymentMethod as PaymentMethodType] || null;

  useEffect(() => {
    settingContext?.updateENV({ terminal: paymentMethod.terminalCode, password: paymentMethod.password })
  }, [settingContext?.paymentMethod])

  return (
    <div className="container mx-auto flex flex-col px-[24px] lg:px-0 lg:flex-row mt-[32px]">
      <div className="flex-[2]">
        <div className="font-bold mb-[16px] ">Items Detail</div>
        <ItemCard />
        <Divider />
        <div className="font-bold mb-[16px] ">Customer Detail</div>
        <CustomerDetails />
        <Divider />
        <div className="mb-[16px] font-bold ">Shipping Address</div>
        <AddressSection />
        <Divider />
      </div>
      <div className="w-[64px]" />
      <div className="flex-1">
        <div className="mb-[16px] font-bold">Payment Methods</div>
        <PaymentMethodsSection />
        {
          paymentMethod ? <paymentMethod.children /> : <></>
        }
      </div>
    </div>
  )
}


export function ItemCard() {

  const settingContext = useContext(SettingsContext)

  return (
    <div className="flex flex-row h-[96px]">
      <img className="aspect-square rounded-lg mr-[24px]" src="https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg" alt="" />
      <div className="flex flex-col justify-center">
        <div className="font-bold text-[14px]">Unlimit T-Shirt</div>
        <div className="text-[14px]">{settingContext?.paymentData.currency}$ {settingContext?.paymentData.amount}</div>
      </div>

    </div>
  )
}

function CustomerDetails() {

  const checkoutDetailsContext = useContext(CheckoutDetailsContext)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-[8px]">
      <div className="">
        <TextField
          title="Full Name"
          type="text"
          value={checkoutDetailsContext?.customer.fullName}
          onChange={(e) => { checkoutDetailsContext?.updateCustomer({ fullName: e.target.value }) }}
        />
      </div>
      <TextField
        title="Email"
        type="text"
        value={checkoutDetailsContext?.customer.email}
        onChange={(e) => { checkoutDetailsContext?.updateCustomer({ email: e.target.value }) }}
      />
      <TextField
        title="Phone Number"
        type="text"
        value={checkoutDetailsContext?.customer.phone}
        onChange={(e) => { checkoutDetailsContext?.updateCustomer({ phone: e.target.value }) }}
      />
    </div>
  )
}

function AddressSection() {

  const checkoutDetailsContext = useContext(CheckoutDetailsContext)

  return (
    <div className="flex flex-col">
      <TextField
        title="Address Line 1"
        type="text"
        value={checkoutDetailsContext?.customer.shipping_address?.addr_line_1}
        onChange={(e) => { checkoutDetailsContext?.updateAddress({ addr_line_1: e.target.value }) }}
      />
      <TextField
        title="Address Line 2"
        type="text"
        value={checkoutDetailsContext?.customer.shipping_address?.addr_line_2}
        onChange={(e) => { checkoutDetailsContext?.updateAddress({ addr_line_2: e.target.value }) }}
      />
      <div className="grid grid-cols-2 gap-[8px]">
        <TextField
          title="City"
          type="text"
          value={checkoutDetailsContext?.customer.shipping_address?.city}
          onChange={(e) => { checkoutDetailsContext?.updateAddress({ city: e.target.value }) }}
        />
        <TextField
          title="Country"
          type="text"
          value={checkoutDetailsContext?.customer.shipping_address?.country}
          onChange={(e) => { checkoutDetailsContext?.updateAddress({ country: e.target.value }) }}
        />
        <TextField
          title="State"
          type="text"
          value={checkoutDetailsContext?.customer.shipping_address?.state}
          onChange={(e) => { checkoutDetailsContext?.updateAddress({ state: e.target.value }) }}
        />
        <TextField
          title="Zip Code"
          type="text"
          value={checkoutDetailsContext?.customer.shipping_address?.zip}
          onChange={(e) => { checkoutDetailsContext?.updateAddress({ zip: e.target.value }) }}
        />
      </div>
    </div>
  )
}

function PaymentMethodsSection() {

  const settingContext = useContext(SettingsContext)

  return (
      <div className="grid grids-cols-1 gap-2 mb-[16px]">
        {
          Object.entries(paymentMethods).map(([key, pm]) => {
            return (
              <OutlinedSelectCard 
              key={key} 
              name={pm.displayName} 
              imgUrl={pm.imgSrc} 
              value={key} 
              groupValue={settingContext!.paymentMethod} 
              onChnage={(v) => {settingContext?.setPaymentMethod(v)}}  />
            )
          })
        }
      </div>
  )
}

