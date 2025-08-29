export type bookingPayload = {
  id?: string;
  check_out: Date;
  check_in: Date;
  rooms: number;
  total_guests: number;
  mattress: number | null;
  amount: number;
  payment_id?: string;
  payment_type?: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  updated_amount?: number;
  state: string;
  payment_status?: string;
  amount_paid?: number;
  amount_due?: number;
  remarks?: string;
};

export enum Role {
  Admin = 'admin',
  User = 'user',
}

export type ContactPayload = {
  full_name: string;
  phone_number: number;
  message: string;
  email: string;
};
