import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, getDocs, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { PROPERTIES as initialData } from '../constants/properties';

export interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  parking: number;
  area: string;
  image: string;
  images?: string[];
  videoUrl?: string;
  pdfUrl?: string;
  floorPlanUrl?: string;
  category: string;
  categorySlug: string;
  code?: string;
  status?: string;
  description?: string;
  broker?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerAddress?: string;
  additionalInfo?: string;
  rooms?: number;
  motoParking?: number;
  hasGourmetBalcony?: boolean;
  elevators?: number;
  hasLavabo?: boolean;
  hasHeatedPool?: boolean;
  hasSauna?: boolean;
  listingType?: 'venda' | 'aluguel';
  condoId?: number;
}

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id'>) => Promise<void>;
  removeProperty: (id: number) => Promise<void>;
  updateProperty: (id: number, property: Partial<Property>) => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const seedProperties = async () => {
      if (!auth.currentUser) return;

      try {
        // Check if seeding has already been attempted/completed
        const configRef = doc(db, 'system_config', 'initial_seed');
        const configSnap = await getDoc(configRef);
        
        if (configSnap.exists() && configSnap.data().initial_seed_completed) {
          return; // Already seeded, don't do it again
        }

        const snapshot = await getDocs(collection(db, 'properties'));
        if (snapshot.empty) {
          for (const property of initialData) {
            await setDoc(doc(db, 'properties', property.id.toString()), property);
          }
          // Mark seeding as completed
          try {
            await setDoc(configRef, { initial_seed_completed: true });
          } catch (e) {
            console.log("Could not mark seed as completed, but properties were seeded.");
          }
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('permission')) {
          console.log("Not authorized to seed properties. Skipping.");
          return;
        }
        handleFirestoreError(error, OperationType.WRITE, 'properties');
      }
    };

    const authUnsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        seedProperties();
      }
    });

    const unsubscribe = onSnapshot(collection(db, 'properties'), (snapshot) => {
      const propertiesData: Property[] = [];
      snapshot.forEach((doc) => {
        propertiesData.push({ ...doc.data(), id: Number(doc.id) } as Property);
      });
      setProperties(propertiesData.sort((a, b) => b.id - a.id)); // Sort by newest first
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'properties');
    });

    return () => {
      authUnsubscribe();
      unsubscribe();
    };
  }, []);

  const addProperty = async (newProp: Omit<Property, 'id'>) => {
    const id = properties.length > 0 ? Math.max(...properties.map(p => p.id)) + 1 : 1;
    try {
      await setDoc(doc(db, 'properties', id.toString()), { ...newProp, id });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'properties');
    }
  };

  const removeProperty = async (id: number) => {
    try {
      await deleteDoc(doc(db, 'properties', id.toString()));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'properties');
    }
  };

  const updateProperty = async (id: number, updatedFields: Partial<Property>) => {
    try {
      await updateDoc(doc(db, 'properties', id.toString()), updatedFields);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'properties');
    }
  };

  return (
    <PropertyContext.Provider value={{ properties, addProperty, removeProperty, updateProperty }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
}
