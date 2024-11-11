export type RegisterType = (RegisterPatient | RegisterPsychologist) & {
  role: "patient" | "psychologist";
};

export interface RegisterPatient {
  name: string;
  birth_day: Date;
  phone: string;
  email: string;
  password: string;
  profilePic: string;
}

export interface RegisterPsychologist extends RegisterPatient {
  tuition_number: string;
}
