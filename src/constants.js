import { MailIcon, UserIcon, PhoneIcon, FolderIcon, CreditCardIcon, ShieldCheckIcon } from './icons';

export const STEPS = [
  { key: 'programme', title: 'Programme Selection', Icon: MailIcon },
  { key: 'student', title: 'Student Information', Icon: UserIcon },
  { key: 'emergency', title: 'Emergency Contact', Icon: PhoneIcon },
  { key: 'documents', title: 'Document Upload', Icon: FolderIcon },
  { key: 'payment', title: 'Payment Details', Icon: CreditCardIcon },
  { key: 'review', title: 'Review & Submit', Icon: ShieldCheckIcon },
];

export const LEVELS_OF_STUDY = ['Diploma', 'Bachelor', 'Master', 'Doctorate', 'Package', 'Other'];

export const ENTRY_QUALIFICATION_TYPES = [
  'Academic Qualification', 'APEL', 'SKM / TVET / Skills Qualification', 'Professional / Other Qualification',
];

export const PROGRAMME_OPTIONS = {
  Diploma: [],
  Bachelor: ['BBA - Bachelor in Business Administration'],
  Master: ['MBA - Master of Business Administration', 'MBM - Master in Business Management', 'MHUM - Master in Hajj & Umrah Management'],
  Doctorate: ['PhD - Doctor of Philosophy in Management', 'DBA - Doctorate of Business Administration'],
  Package: ['MBM + PhD - Master in Business Management & PhD (Package)', 'MBA + PhD - Master of Business Administration & PhD (Package)'],
  Other: ['Other'],
};

export const COUNTRIES = ['Malaysia','Afghanistan','Albania','Algeria','Andorra','Bangladesh','Brunei','Cambodia','China','India','Indonesia','Nepal','Pakistan','Singapore','Sri Lanka','Thailand','Vietnam','Zimbabwe','Other'];
export const NATIONALITIES = ['Malaysian','Bruneian','Indonesian','Singaporean','Thai','Filipino','Chinese (China)','Indian (India)','Bangladeshi','Nepalese','Pakistani','Sri Lankan','Myanmar','Vietnamese','Cambodian','Other'];
export const RACES = ['Please Select','Bajau','Bidayuh','Bisaya','Brunei','Bugis','Bumiputera Sabah','Bumiputera Sarawak','Dusun','Iban','India','Indian Muslim','Jakun','Jawa','Kadazan','Kayan','Kelabit','Kedayan','Kenyah','Malay','Melanau','Murut','Other'];
export const RELIGIONS = ['Islam','Christianity (Christian)','Buddhism','Hinduism','Sikhism','Taoism','Confucianism','Bahai','Judaism','No Religion','Others'];
export const MARITAL_STATUSES = ['Single', 'Married', 'Married (Separated)', 'Divorced', 'Widowed'];
export const RELATIONSHIPS = ['Father', 'Mother', 'Spouse', 'Friend', 'Guardian'];
export const INSTALLMENT_FREQUENCIES = ['6 months', '12 months'];
export const PAYMENT_SOURCES = ['EPF Withdrawal (KWSP)', 'Cash / Online Transfer', 'Sponsorship / Staff Benefit', 'Loan / Financing', 'Other'];
export const REFERRAL_SOURCES = ['Agent / Partner', 'Education Consultant', 'Friend / Family', 'Social Media', 'Walk-in / Direct Enquiry', 'Other'];

export const INITIAL_FORM = {
  capturedEmail: '', applicantType: '', levelOfStudy: '', programme: '', entryQualificationType: '',
  proposedSupervisor: '', referralSource: '', referralSourceOther: '',
  fullName: '', idPassport: '', gender: '', email: '', phoneNumber: '', country: '',
  fullAddress: '', placeOfBirth: '', nationality: '', race: '', religion: '', maritalStatus: '',
  emergencyName: '', emergencyRelationship: '', emergencyPhone: '', emergencyAddress: '',
  paymentArrangement: '', installmentFrequency: '', paymentSource: '', paymentSourceOther: '',
  declarationAccepted: false,
  documents: {
    identityDocument: null, passportPhoto: null, apelCertificate: null, transcript: null,
    certificate: null, otherSupportingDocument: null, englishCertificate: null, cvResume: null,
  },
};

export function toUpper(v) { return v.toUpperCase(); }
export function toTitle(v) {
  return v.toLowerCase().trim().split(/\s+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
export function isBlank(v) { return !v || v.trim().length === 0; }

export function getVisibleDocs(eq) {
  return {
    showApel: eq === 'APEL',
    showTranscript: eq === 'Academic Qualification',
    showCert: eq === 'Academic Qualification' || eq === 'SKM / TVET / Skills Qualification',
    showOther: !isBlank(eq),
    showEnglish: !isBlank(eq),
    showCv: !isBlank(eq),
  };
}
