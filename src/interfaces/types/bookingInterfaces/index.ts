export type bookingPayload = {
  check_in: Date;
  check_out: Date;
  rooms: number;
  guest_per_room: number;
  mattress: number | null;
  first_name: string;
  last_name: string;
  phone_number: number;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  amount: number;
  payment_id: string;
  payment_type: string;
};
