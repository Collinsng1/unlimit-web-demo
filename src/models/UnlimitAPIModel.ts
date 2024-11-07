
export interface IPaymentRequest {
    request : IRequest
    merchant_order : IMerchantOrder
    payment_method : string
    payment_data : IPaymentData
    customer : ICustomer
    card_account? : ICardAccount
    return_urls? : IReturnURLs
}

export interface IRequest {
    id : string
    time : string
}

export interface IMerchantOrder {
    id : string
    description : string
}

export interface IPaymentData {
    amount : number
    currency : string
    encrypted_data? : string
    preauth? : boolean
    three_ds_mode? : string
}

export interface ICustomer {
    fullName?: string
    email: string
    phone?: string
    shipping_address?: IAddress
    ip? : string
    user_agent? : string
    browser_info? : IBrowserInfo
}

export interface IBrowserInfo {
    color_depth : number
    screen_height : number
    screen_width : number
    java_enabled : boolean
    java_script_enabled : boolean
    language: string
    time_zone : number
    accept_header : string
}

export interface ICardAccount {
    card : ICard
}

export interface ICard {
    pan : string
    holder : string
    expiration : string
    security_code : string
}

export interface IReturnURLs {
    success_url : string
    decline_url : string
    return_url? : string
    cancel_url? : string
    inprocess_url? : string
}

export interface IAddress {
    addr_line_1? : string
    addr_line_2? : string
    city? : string
    state? : string
    country? : string
    zip? : string
}

export interface UpdatePaymentReq {
    request : IRequest,
    operation : "CONFIRM_3DS"
    CRes : string
}