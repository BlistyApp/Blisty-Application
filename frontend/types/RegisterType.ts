export interface RegisterType {
  name: string;
  birth_day: Date;
  phone: string;
  email: string;
  password: string;
  type: string;
}

export interface Psychologist extends RegisterType {
  tuition_number: string;
}
