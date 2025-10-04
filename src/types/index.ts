export interface Package {
  id: string;
  title: string;
  description: string;
  target: string;
  modules: Module[];
}

export interface Module {
  id: string;
  name: string;
  description?: string;
  mediaUrl?: string;
  exampleJson?: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface SelectedModule {
  name: string;
  price: string;
  category: 'individual' | 'influencer' | 'corporate';
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company?: string;
  packageType: 'individual' | 'influencer' | 'corporate';
  selectedModules: SelectedModule[];
  totalPrice: number;
  message: string;
}