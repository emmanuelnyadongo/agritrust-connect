export type UserRole = 'farmer' | 'buyer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  location: string;
  joined: string;
  completedTransactions: number;
  rating: number;
}

export interface Listing {
  id: string;
  produce: string;
  variety: string;
  quantity: string;
  unit: string;
  quality: string;
  location: string;
  farmer: { id: string; name: string; rating: number; transactions: number };
  pricePerUnit: number;
  marketLow: number;
  marketHigh: number;
  marketMedian: number;
  availableFrom: string;
  availableUntil: string;
  description: string;
  status: 'active' | 'in_negotiation' | 'sold';
  createdAt: string;
}

export interface Negotiation {
  id: string;
  listingId: string;
  produce: string;
  quantity: string;
  buyer: { id: string; name: string };
  farmer: { id: string; name: string };
  status: 'active' | 'agreed' | 'declined' | 'expired';
  offers: Offer[];
  systemGuidance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  from: 'farmer' | 'buyer';
  price: number;
  note: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  produce: string;
  quantity: string;
  agreedPrice: number;
  buyer: { id: string; name: string };
  farmer: { id: string; name: string };
  date: string;
  status: 'completed' | 'disputed' | 'pending';
}
