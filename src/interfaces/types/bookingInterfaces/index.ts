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
};

export enum Role {
  Admin = 'admin',
  User = 'user',
}

export type usersPayload = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
};
