export type Bank = {
  id: string;
  name: string;
  short: string;
  color: string; // hex
  fg: string; // foreground on color
  initials: string;
};

export const banks: Bank[] = [
  { id: "hdfc", name: "HDFC Bank", short: "HDFC", color: "#ED232A", fg: "#ffffff", initials: "H" },
  { id: "icici", name: "ICICI Bank", short: "ICICI", color: "#F58220", fg: "#ffffff", initials: "I" },
  { id: "axis", name: "Axis Bank", short: "Axis", color: "#97144D", fg: "#ffffff", initials: "A" },
  { id: "sbi", name: "State Bank of India", short: "SBI", color: "#22409A", fg: "#ffffff", initials: "S" },
  { id: "kotak", name: "Kotak Mahindra Bank", short: "Kotak", color: "#EF3E42", fg: "#ffffff", initials: "K" },
  { id: "indusind", name: "IndusInd Bank", short: "IndusInd", color: "#9B1B30", fg: "#ffffff", initials: "In" },
  { id: "yes", name: "Yes Bank", short: "Yes", color: "#00518F", fg: "#ffffff", initials: "Y" },
  { id: "canara", name: "Canara Bank", short: "Canara", color: "#00573F", fg: "#ffffff", initials: "C" },
  { id: "pnb", name: "Punjab National Bank", short: "PNB", color: "#A8253A", fg: "#ffffff", initials: "P" },
  { id: "bob", name: "Bank of Baroda", short: "BoB", color: "#F1592A", fg: "#ffffff", initials: "B" },
];

export const branches = [
  { id: "koramangala", name: "Koramangala Branch", address: "80 Feet Rd, 4th Block, Koramangala", distance: "2.1 km" },
  { id: "indiranagar", name: "Indiranagar Branch", address: "100 Feet Rd, Indiranagar", distance: "3.4 km" },
  { id: "whitefield", name: "Whitefield Branch", address: "ITPL Main Rd, Whitefield", distance: "12.8 km" },
  { id: "jpnagar", name: "JP Nagar Branch", address: "24th Main Rd, JP Nagar 2nd Phase", distance: "5.6 km" },
  { id: "mgroad", name: "MG Road Branch", address: "MG Road, near Trinity Circle", distance: "4.2 km" },
];

export const services = [
  { id: "account", name: "Account Opening", desc: "Open savings or current account" },
  { id: "loan", name: "Loan Consultation", desc: "Home, personal & vehicle loans" },
  { id: "kyc", name: "KYC / Document Submission", desc: "Update or submit KYC documents" },
  { id: "locker", name: "Locker Access", desc: "Access your safe deposit locker" },
  { id: "card", name: "Credit Card Query", desc: "Apply or resolve card issues" },
  { id: "general", name: "General Banking", desc: "Other in-branch services" },
];

export function generateSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h < 16; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
    slots.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return slots;
}

export function next7Days(): Date[] {
  const arr: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    arr.push(d);
  }
  return arr;
}

// deterministic "booked" slots per date+branch so it feels real
export function bookedSlots(key: string): Set<string> {
  const all = generateSlots();
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  const booked = new Set<string>();
  const count = 3 + (hash % 5);
  for (let i = 0; i < count; i++) {
    hash = (hash * 1103515245 + 12345) >>> 0;
    booked.add(all[hash % all.length]);
  }
  return booked;
}
