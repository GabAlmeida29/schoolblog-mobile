import type { UserForm } from '@/schemas';
import type { User, UserInput, UserKind } from '@/types';
import { brDateToIso, isoToBrDate, maskPhone, onlyDigits } from './format';

const nullable = (value: string) => (value.trim() === '' ? null : value.trim());

export const emptyUserForm: UserForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  subject: '',
  education: '',
  bio: '',
  registration: '',
  classGroup: '',
  birthDate: '',
  guardianName: '',
};

export function userToForm(user: User): UserForm {
  return {
    name: user.name,
    email: user.email,
    password: '',
    phone: user.phone ? maskPhone(user.phone) : '',
    subject: user.subject ?? '',
    education: user.education ?? '',
    bio: user.bio ?? '',
    registration: user.registration ?? '',
    classGroup: user.classGroup ?? '',
    birthDate: isoToBrDate(user.birthDate),
    guardianName: user.guardianName ?? '',
  };
}

export function formToUserInput(kind: UserKind, values: UserForm): UserInput {
  const base: UserInput = {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: onlyDigits(values.phone) || null,
    ...(values.password ? { password: values.password } : {}),
  };

  if (kind === 'teachers') {
    return {
      ...base,
      subject: nullable(values.subject),
      education: nullable(values.education),
      bio: nullable(values.bio),
    };
  }

  return {
    ...base,
    registration: nullable(values.registration),
    classGroup: nullable(values.classGroup),
    birthDate: values.birthDate ? brDateToIso(values.birthDate) : null,
    guardianName: nullable(values.guardianName),
  };
}
