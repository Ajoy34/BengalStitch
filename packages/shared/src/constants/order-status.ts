import type { OrderStatus } from '../types';

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; labelBn: string; color: string; icon: string }
> = {
  PENDING: {
    label: 'Pending',
    labelBn: 'অপেক্ষমান',
    color: '#948da2',
    icon: 'hourglass_empty',
  },
  PAID: {
    label: 'Paid',
    labelBn: 'পরিশোধিত',
    color: '#00dddd',
    icon: 'check_circle',
  },
  PROCESSING: {
    label: 'Processing',
    labelBn: 'প্রক্রিয়াধীন',
    color: '#cfbdff',
    icon: 'sync',
  },
  PRINTED: {
    label: 'Printed',
    labelBn: 'মুদ্রিত',
    color: '#ffabf3',
    icon: 'print',
  },
  SHIPPED: {
    label: 'Shipped',
    labelBn: 'প্রেরিত',
    color: '#00dddd',
    icon: 'local_shipping',
  },
  DELIVERED: {
    label: 'Delivered',
    labelBn: 'বিতরিত',
    color: '#00fb00',
    icon: 'inventory',
  },
  RETURNED: {
    label: 'Returned',
    labelBn: 'ফেরত',
    color: '#ffb4ab',
    icon: 'assignment_return',
  },
  CANCELLED: {
    label: 'Cancelled',
    labelBn: 'বাতিল',
    color: '#ff4444',
    icon: 'cancel',
  },
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'PENDING',
  'PAID',
  'PROCESSING',
  'PRINTED',
  'SHIPPED',
  'DELIVERED',
];
