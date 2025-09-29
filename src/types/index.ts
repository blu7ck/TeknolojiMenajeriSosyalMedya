export interface Package {
  id: string;
  title: string;
  description: string;
  target: string;
  modules: Module[];
  pricing: string;
  features: string[];
}

export interface Module {
  name: string;
  description: string;
  deliverables: string;
  price: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface SelectedModule {
  name: string;
  price: string;
  category: 'individual' | 'influencer' | 'business';
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company?: string;
  packageType: 'individual' | 'influencer' | 'business';
  selectedModules: SelectedModule[];
  totalPrice: number;
  message: string;
}