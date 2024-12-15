export interface RegisterType extends RegisterPatient, RegisterPsychologist {
  role: "patient" | "psychologist";
}
export interface RegisterPatient {
  name: string;
  birth_day: Date;
  phone: string;
  email: string;
  password: string;
  profilePic: string;
  terms: boolean;
}

export interface RegisterPsychologist extends RegisterPatient {
  tuition_number: string;
  mTags: string[];
  tags: string[];
  experience: {
    mode: string;
    years: string;
  };
  experience_string?: string;
  description: string;
  available_mode: string;
}
