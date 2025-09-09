export type CurrencyCode = 'USD' | 'INR';
export type TermType = 'MONTHLY' | 'YEARLY';
export type ContractStatus = 'AVAILABLE' | 'COMPLETED' | 'UNAVAILABLE';
export type CashKickStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CashKick {
    id: number;
    name: string;
    status: CashKickStatus;
    totalFinanced: number;
    totalRecieved: number;
    currencyCode: CurrencyCode;
    rate: number;
    maturity: string;
}

export interface CreditLimit {
    availableCreditAmount: number;
    currencyCode: CurrencyCode;
    rate: number;
    termPeriod: number;
    termType: TermType;
    totalAmount: number;
}

export interface Contract {
    id: number;
    name: string;
    currencyCode: CurrencyCode;
    type: TermType;
    perPayment: number;
    totalAvailable: number;
    totalFinanced: number;
    status: ContractStatus;
    termLength: number;
    fee: number;
}

export interface CashKickCreateRequest {
    contracts: number[];
    rate: number;
    payBackAmount: number;
    name: string;
    currencyCode: CurrencyCode;
}

// API Response types for better type safety
export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

// Error handling interface
export interface ApiError {
    message: string;
    status: number;
    error: any;
}
