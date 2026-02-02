import { createContext, useContext, useState, ReactNode } from 'react';
import { MedicationOrder, Patient, Medication } from '@/lib/types';
import { medicationOrders as initialOrders, patients, medications } from '@/lib/mockData';

interface MedicationOrdersContextType {
  orders: MedicationOrder[];
  addOrder: (order: Omit<MedicationOrder, 'id' | 'orderedAt' | 'status'>) => void;
  updateOrderStatus: (orderId: string, status: MedicationOrder['status']) => void;
  getPatientById: (id: string) => Patient | undefined;
  getMedicationById: (id: string) => Medication | undefined;
  patients: Patient[];
  medications: Medication[];
}

const MedicationOrdersContext = createContext<MedicationOrdersContextType | null>(null);

export function MedicationOrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<MedicationOrder[]>(initialOrders);

  const addOrder = (orderData: Omit<MedicationOrder, 'id' | 'orderedAt' | 'status'>) => {
    const newOrder: MedicationOrder = {
      ...orderData,
      id: `order-${Date.now()}`,
      orderedAt: new Date(),
      status: 'pending',
      dueTime: new Date(Date.now() + 30 * 60 * 1000), // Due in 30 minutes
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: MedicationOrder['status']) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const getPatientById = (id: string) => patients.find((p) => p.id === id);
  const getMedicationById = (id: string) => medications.find((m) => m.id === id);

  return (
    <MedicationOrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getPatientById,
        getMedicationById,
        patients,
        medications,
      }}
    >
      {children}
    </MedicationOrdersContext.Provider>
  );
}

export function useMedicationOrders() {
  const context = useContext(MedicationOrdersContext);
  if (!context) {
    throw new Error('useMedicationOrders must be used within a MedicationOrdersProvider');
  }
  return context;
}
