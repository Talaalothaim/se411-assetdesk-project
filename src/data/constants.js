// Enum codes match the Java enums planned for Part 2. Labels are for display only.

export const TYPES = ['LAPTOP', 'MONITOR', 'DESKTOP', 'ACCESSORY']
export const CONDITIONS = ['NEW', 'GOOD', 'FAIR', 'DAMAGED']
export const STATUSES = ['AVAILABLE', 'ASSIGNED', 'IN_REPAIR']

export const TYPE_LABELS = {
  LAPTOP: 'Laptop',
  MONITOR: 'Monitor',
  DESKTOP: 'Desktop',
  ACCESSORY: 'Accessory',
}

export const TYPE_PLURAL_LABELS = {
  LAPTOP: 'Laptops',
  MONITOR: 'Monitors',
  DESKTOP: 'Desktops',
  ACCESSORY: 'Accessories',
}

export const CONDITION_LABELS = {
  NEW: 'New',
  GOOD: 'Good',
  FAIR: 'Fair',
  DAMAGED: 'Damaged',
}

export const STATUS_LABELS = {
  AVAILABLE: 'Available',
  ASSIGNED: 'Assigned',
  IN_REPAIR: 'In Repair',
}

export const PAGE_SIZES = [5, 10, 20]
export const DEFAULT_PAGE_SIZE = 5

/** Values for a brand-new asset in the Add form. */
export const EMPTY_ASSET = {
  deviceName: '',
  type: 'LAPTOP',
  serialNumber: '',
  assignedTo: '',
  condition: 'NEW',
  purchaseDate: '',
  status: 'AVAILABLE',
}
