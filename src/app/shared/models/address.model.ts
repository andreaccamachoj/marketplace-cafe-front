export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  coordinates?: { lat: number; lng: number };
}
