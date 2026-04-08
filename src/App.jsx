import React, { useState, useMemo, useCallback } from 'react';
import { BuildingIcon, UploadIcon, CheckIcon } from './icons';
import {
  STEPS, LEVELS_OF_STUDY, ENTRY_QUALIFICATION_TYPES, PROGRAMME_OPTIONS,
  COUNTRIES, NATIONALITIES, RACES, RELIGIONS, MARITAL_STATUSES, RELATIONSHIPS,
  INSTALLMENT_FREQUENCIES, PAYMENT_SOURCES, REFERRAL_SOURCES, INITIAL_FORM,
  toUpper, toTitle, isBlank, getVisibleDocs,
} from './constants';

/* ─── Small reusable pieces ─── */

function FieldError({ msg }) {
  return msg ? <p className="field-error">{msg}</p> : null;
}

function RadioOption({ label, selected, onClick }) {
  return (
    <label className={`radio-option${selected ? ' selected' : ''}`} onClick={onClick}>
      <span className="radio-dot" />
      <span>{label}</span>
    </label>
  );
}

function SelectField({ value, onChange, placeholder, options, disabled }) {
  return (
    <select className="select" value={value} onChange={e => onChange(e.target.value)} disabled={disabled}>
      <option value="" disabled>{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function FileRow({ label, required, note, file, onChange }) {
  return (
    <div className="file-row">
      <div className="file-row-inner">
        <div>
          <p className="file-row-label">{label} {required && <span className="required">*</span>}</p>
          {note && <p className="file-row-note">{note}</p>}
          {file && <p className="file-row-selected">Selected: {file.name}</p>}
        </div>
        <label className="upload-btn">
          <UploadIcon /> Upload File
          <input type="file" onChange={e => onChange(e.target.files?.[0] ?? null)} />
        </label>
      </div>
    </div>
  );
}

/* ─── Step sections ─── */

function ProgrammeSection({ form, errors, update }) {
  const progs = PROGRAMME_OPTIONS[form.levelOfStudy] || [];
  const isDiploma = form.levelOfStudy === 'Diploma';
  const showSpecify = ['Agent / Partner', 'Education Consultant', 'Other'].includes(form.referralSource);
  const placeholder = isDiploma ? 'Diploma programme list will be available soon' : (!form.levelOfStudy ? 'Please select level of study first' : 'Select programme');

  return (
    <div className="form-grid">
      <div>
        <label>Email <span className="required">*</span></label>
        <input className="input" type="email" value={form.capturedEmail} onChange={e => update('capturedEmail', e.target.value)} placeholder="yourname@email.com" />
        <FieldError msg={errors.capturedEmail} />
      </div>
      <div>
        <label>Applicant Type <span className="required">*</span></label>
        <div className="radio-group-2">
          <RadioOption label="Local (Malaysian Citizen)" selected={form.applicantType === 'Local (Malaysian Citizen)'} onClick={() => update('applicantType', 'Local (Malaysian Citizen)')} />
          <RadioOption label="International (Non-Malaysian Citizen)" selected={form.applicantType === 'International (Non-Malaysian Citizen)'} onClick={() => update('applicantType', 'International (Non-Malaysian Citizen)')} />
        </div>
        <FieldError msg={errors.applicantType} />
      </div>
      <div>
        <label>Level of Study <span className="required">*</span></label>
        <SelectField value={form.levelOfStudy} onChange={v => update('levelOfStudy', v)} placeholder="Select level of study" options={LEVELS_OF_STUDY} />
        <FieldError msg={errors.levelOfStudy} />
      </div>
      <div>
        <label>Intended Programme of Study <span className="required">*</span></label>
        <SelectField value={form.programme} onChange={v => update('programme', v)} placeholder={placeholder} options={progs} disabled={!form.levelOfStudy || isDiploma} />
        {isDiploma && <p className="hint">Diploma programme list will be available soon.</p>}
        <FieldError msg={errors.programme} />
      </div>
      <div>
        <label>Entry Qualification Type <span className="required">*</span></label>
        <SelectField value={form.entryQualificationType} onChange={v => update('entryQualificationType', v)} placeholder="Select entry qualification type" options={ENTRY_QUALIFICATION_TYPES} />
        <FieldError msg={errors.entryQualificationType} />
      </div>
      <div>
        <label>Proposed Supervisor (if any)</label>
        <input className="input" value={form.proposedSupervisor} onChange={e => update('proposedSupervisor', e.target.value)} placeholder="Enter supervisor name" />
      </div>
      <div>
        <label>How did you hear about us / Referral Source</label>
        <SelectField value={form.referralSource} onChange={v => update('referralSource', v)} placeholder="Select referral source" options={REFERRAL_SOURCES} />
      </div>
      {showSpecify && (
        <div>
          <label>Please specify referral / agent name</label>
          <input className="input" value={form.referralSourceOther} onChange={e => update('referralSourceOther', e.target.value)} placeholder="Example: agent name, consultant name, organisation name" />
          <FieldError msg={errors.referralSourceOther} />
        </div>
      )}
    </div>
  );
}

function StudentSection({ form, errors, update }) {
  const nameHint = toTitle(form.fullName || 'ahmad bin ali');
  return (
    <div className="form-grid-2">
      <div>
        <label>Full Name <span className="required">*</span></label>
        <input className="input uppercase" value={form.fullName} onChange={e => update('fullName', toUpper(e.target.value))} />
        <p className="hint">Stored in uppercase. In letters, it can be converted to title case automatically, for example: {nameHint}.</p>
        <FieldError msg={errors.fullName} />
      </div>
      <div>
        <label>ID / Passport Number <span className="required">*</span></label>
        <input className="input" value={form.idPassport} onChange={e => update('idPassport', e.target.value)} />
        <FieldError msg={errors.idPassport} />
      </div>
      <div>
        <label>Gender <span className="required">*</span></label>
        <div className="radio-inline">
          <RadioOption label="Male" selected={form.gender === 'Male'} onClick={() => update('gender', 'Male')} />
          <RadioOption label="Female" selected={form.gender === 'Female'} onClick={() => update('gender', 'Female')} />
        </div>
        <FieldError msg={errors.gender} />
      </div>
      <div>
        <label>Email Address <span className="required">*</span></label>
        <input className="input" type="email" value={form.email} onChange={e => update('email', e.target.value)} />
        <FieldError msg={errors.email} />
      </div>
      <div>
        <label>Phone Number <span className="required">*</span></label>
        <input className="input" value={form.phoneNumber} onChange={e => update('phoneNumber', e.target.value)} />
        <FieldError msg={errors.phoneNumber} />
      </div>
      <div>
        <label>Country <span className="required">*</span></label>
        <SelectField value={form.country} onChange={v => update('country', v)} placeholder="Select country" options={COUNTRIES} />
        <FieldError msg={errors.country} />
      </div>
      <div className="col-span-2">
        <label>Full Address <span className="required">*</span></label>
        <textarea className="textarea uppercase" value={form.fullAddress} onChange={e => update('fullAddress', toUpper(e.target.value))} />
        <FieldError msg={errors.fullAddress} />
      </div>
      <div>
        <label>Place of Birth (Include State of Birth) <span className="required">*</span></label>
        <input className="input uppercase" value={form.placeOfBirth} onChange={e => update('placeOfBirth', toUpper(e.target.value))} placeholder="HOSPITAL BESAR ALOR SETAR, KEDAH" />
        <FieldError msg={errors.placeOfBirth} />
      </div>
      <div>
        <label>Nationality <span className="required">*</span></label>
        <SelectField value={form.nationality} onChange={v => update('nationality', v)} placeholder="Select nationality" options={NATIONALITIES} />
        <FieldError msg={errors.nationality} />
      </div>
      <div>
        <label>Race <span className="required">*</span></label>
        <SelectField value={form.race} onChange={v => update('race', v)} placeholder="Select race" options={RACES} />
        <FieldError msg={errors.race} />
      </div>
      <div>
        <label>Religion <span className="required">*</span></label>
        <SelectField value={form.religion} onChange={v => update('religion', v)} placeholder="Select religion" options={RELIGIONS} />
        <FieldError msg={errors.religion} />
      </div>
      <div>
        <label>Marital Status <span className="required">*</span></label>
        <SelectField value={form.maritalStatus} onChange={v => update('maritalStatus', v)} placeholder="Select marital status" options={MARITAL_STATUSES} />
        <FieldError msg={errors.maritalStatus} />
      </div>
    </div>
  );
}

function EmergencySection({ form, errors, update }) {
  return (
    <div className="form-grid-2">
      <div>
        <label>Full Name of Emergency Contact <span className="required">*</span></label>
        <input className="input" value={form.emergencyName} onChange={e => update('emergencyName', e.target.value)} />
        <FieldError msg={errors.emergencyName} />
      </div>
      <div>
        <label>Relationship to Applicant <span className="required">*</span></label>
        <SelectField value={form.emergencyRelationship} onChange={v => update('emergencyRelationship', v)} placeholder="Select relationship" options={RELATIONSHIPS} />
        <FieldError msg={errors.emergencyRelationship} />
      </div>
      <div>
        <label>Emergency Contact Phone Number <span className="required">*</span></label>
        <input className="input" value={form.emergencyPhone} onChange={e => update('emergencyPhone', e.target.value)} />
        <FieldError msg={errors.emergencyPhone} />
      </div>
      <div className="col-span-2">
        <label>Emergency Contact Address</label>
        <textarea className="textarea uppercase" value={form.emergencyAddress} onChange={e => update('emergencyAddress', toUpper(e.target.value))} placeholder="Leave blank if same as applicant address" />
      </div>
    </div>
  );
}

function DocumentsSection({ form, errors, updateDoc }) {
  const v = getVisibleDocs(form.entryQualificationType);
  const eq = form.entryQualificationType;
  const cvReq = eq === 'APEL' || eq === 'Professional / Other Qualification';
  const cvNote = cvReq ? 'Required for this admission pathway. Include academic background and work experience.' : 'Optional. Include academic background and work experience if available.';
  const engNote = form.applicantType === 'International (Non-Malaysian Citizen)' ? 'May be required subject to admission requirements for international applicants. Example: IELTS / TOEFL.' : 'Optional. Example: IELTS / TOEFL.';
  const certLabel = eq === 'SKM / TVET / Skills Qualification' ? 'Relevant Skills Certificate' : 'Highest Academic Certificate';
  const certNote = eq === 'SKM / TVET / Skills Qualification' ? 'Upload your relevant SKM, TVET, or skills qualification certificate.' : 'Required for applicants applying through academic qualification pathway.';

  return (
    <div className="form-grid">
      <FileRow label="Identity Document (IC/Passport)" required file={form.documents.identityDocument} onChange={f => updateDoc('identityDocument', f)} />
      <FieldError msg={errors.identityDocument} />
      <FileRow label="Passport Size Photo" required note="This photo will be used for Student ID Card and Student Portal profile." file={form.documents.passportPhoto} onChange={f => updateDoc('passportPhoto', f)} />
      <FieldError msg={errors.passportPhoto} />
      {v.showApel && <>
        <FileRow label="APEL Certificate" required={eq === 'APEL'} note="Required for applicants applying through APEL pathway." file={form.documents.apelCertificate} onChange={f => updateDoc('apelCertificate', f)} />
        <FieldError msg={errors.apelCertificate} />
      </>}
      {v.showTranscript && <>
        <FileRow label="Highest Academic Transcript" required note="Required for applicants applying through academic qualification pathway." file={form.documents.transcript} onChange={f => updateDoc('transcript', f)} />
        <FieldError msg={errors.transcript} />
      </>}
      {v.showCert && <>
        <FileRow label={certLabel} required note={certNote} file={form.documents.certificate} onChange={f => updateDoc('certificate', f)} />
        <FieldError msg={errors.certificate} />
      </>}
      {v.showOther && <>
        <FileRow label="Other Supporting Document" required={eq === 'Professional / Other Qualification'} note="Upload any additional supporting document relevant to your admission pathway." file={form.documents.otherSupportingDocument} onChange={f => updateDoc('otherSupportingDocument', f)} />
        <FieldError msg={errors.otherSupportingDocument} />
      </>}
      {v.showEnglish && <FileRow label="English Language Proficiency Certificate" note={engNote} file={form.documents.englishCertificate} onChange={f => updateDoc('englishCertificate', f)} />}
      {v.showCv && <>
        <FileRow label="Curriculum Vitae (CV) / Resume" required={cvReq} note={cvNote} file={form.documents.cvResume} onChange={f => updateDoc('cvResume', f)} />
        <FieldError msg={errors.cvResume} />
      </>}
    </div>
  );
}

function PaymentSection({ form, errors, update }) {
  return (
    <div className="form-grid">
      <div>
        <label>Payment Arrangement <span className="required">*</span></label>
        <div className="radio-group-2">
          <RadioOption label="Lump Sum (One-time payment)" selected={form.paymentArrangement === 'Lump Sum'} onClick={() => update('paymentArrangement', 'Lump Sum')} />
          <RadioOption label="Installment Plan (Every 7th each month)" selected={form.paymentArrangement === 'Installment Plan'} onClick={() => update('paymentArrangement', 'Installment Plan')} />
          <RadioOption label="Semester Based Payment" selected={form.paymentArrangement === 'Semester Based Payment'} onClick={() => update('paymentArrangement', 'Semester Based Payment')} />
        </div>
        <FieldError msg={errors.paymentArrangement} />
      </div>
      {form.paymentArrangement === 'Installment Plan' && (
        <div>
          <label>Preferred Frequency <span className="required">*</span></label>
          <p className="hint" style={{ marginTop: 4, marginBottom: 0 }}>Available only for installment plan.</p>
          <SelectField value={form.installmentFrequency} onChange={v => update('installmentFrequency', v)} placeholder="Select frequency" options={INSTALLMENT_FREQUENCIES} />
          <FieldError msg={errors.installmentFrequency} />
        </div>
      )}
      <div>
        <label>Payment Source <span className="required">*</span></label>
        <div className="radio-group-2">
          {PAYMENT_SOURCES.map(s => (
            <RadioOption key={s} label={s} selected={form.paymentSource === s} onClick={() => update('paymentSource', s)} />
          ))}
        </div>
        <FieldError msg={errors.paymentSource} />
      </div>
      {form.paymentSource === 'Other' && (
        <div>
          <label>Please Specify</label>
          <input className="input" value={form.paymentSourceOther} onChange={e => update('paymentSourceOther', e.target.value)} />
          <FieldError msg={errors.paymentSourceOther} />
        </div>
      )}
    </div>
  );
}

function ReviewSection({ form, errors, update }) {
  const paySource = form.paymentSource === 'Other' ? (form.paymentSourceOther || 'Other') : (form.paymentSource || '-');
  return (
    <>
      <div className="review-banner"><h3>Review Your Application</h3><p>Please review the summary before submitting.</p></div>
      <div className="review-grid">
        <div className="review-card">
          <div className="review-card-header">Programme</div>
          <div className="review-card-body">
            <p><span className="rv-label">Email:</span> {form.capturedEmail || '-'}</p>
            <p><span className="rv-label">Applicant Type:</span> {form.applicantType || '-'}</p>
            <p><span className="rv-label">Level of Study:</span> {form.levelOfStudy || '-'}</p>
            <p><span className="rv-label">Programme:</span> {form.programme || '-'}</p>
            <p><span className="rv-label">Entry Qualification Type:</span> {form.entryQualificationType || '-'}</p>
            <p><span className="rv-label">Supervisor:</span> {form.proposedSupervisor || '-'}</p>
            <p><span className="rv-label">Referral:</span> {form.referralSourceOther || form.referralSource || '-'}</p>
          </div>
        </div>
        <div className="review-card">
          <div className="review-card-header">Student Information</div>
          <div className="review-card-body">
            <p><span className="rv-label">Full Name:</span> {toTitle(form.fullName) || '-'}</p>
            <p><span className="rv-label">ID / Passport:</span> {form.idPassport || '-'}</p>
            <p><span className="rv-label">Email:</span> {form.email || '-'}</p>
            <p><span className="rv-label">Phone:</span> {form.phoneNumber || '-'}</p>
            <p><span className="rv-label">Country:</span> {form.country || '-'}</p>
          </div>
        </div>
        <div className="review-card">
          <div className="review-card-header">Emergency Contact</div>
          <div className="review-card-body">
            <p><span className="rv-label">Name:</span> {form.emergencyName || '-'}</p>
            <p><span className="rv-label">Relationship:</span> {form.emergencyRelationship || '-'}</p>
            <p><span className="rv-label">Phone:</span> {form.emergencyPhone || '-'}</p>
          </div>
        </div>
        <div className="review-card">
          <div className="review-card-header">Payment</div>
          <div className="review-card-body">
            <p><span className="rv-label">Arrangement:</span> {form.paymentArrangement || '-'}</p>
            <p><span className="rv-label">Frequency:</span> {form.installmentFrequency || '-'}</p>
            <p><span className="rv-label">Source:</span> {paySource}</p>
          </div>
        </div>
      </div>
      <div className="declaration-box">
        <div className="checkbox-row">
          <div className={`checkbox-box${form.declarationAccepted ? ' checked' : ''}`} onClick={() => update('declarationAccepted', !form.declarationAccepted)}>
            <CheckIcon />
          </div>
          <div>
            <label style={{ cursor: 'pointer', fontSize: 13, lineHeight: 1.6 }} onClick={() => update('declarationAccepted', !form.declarationAccepted)}>
              I hereby confirm that all information and documents submitted in this form are true, complete, and accurate to the best of my knowledge. I understand that Innovative University College reserves the right to reject, defer, withdraw, or revoke this application or any offer issued if any information or document provided is found to be false, misleading, incomplete, or invalid.
            </label>
            <FieldError msg={errors.declarationAccepted} />
          </div>
        </div>
      </div>
      <hr className="separator" />
      <div className="note-box">
        On live deployment, this form can post data to Google Apps Script, save all responses into Google Sheets, create the student folder in Google Drive, upload all supporting documents into that folder, and send the acknowledgement email automatically.
      </div>
    </>
  );
}

/* ─── Validation ─── */

function validate(step, form) {
  const e = {};
  if (step === 0) {
    if (isBlank(form.capturedEmail)) e.capturedEmail = 'Email is required.';
    if (isBlank(form.applicantType)) e.applicantType = 'Please select applicant type.';
    if (isBlank(form.levelOfStudy)) e.levelOfStudy = 'Please select level of study.';
    if (isBlank(form.programme)) e.programme = form.levelOfStudy === 'Diploma' ? 'Diploma programme list is not available yet.' : 'Please select intended programme.';
    if (isBlank(form.entryQualificationType)) e.entryQualificationType = 'Please select entry qualification type.';
    if (['Agent / Partner', 'Education Consultant', 'Other'].includes(form.referralSource) && isBlank(form.referralSourceOther)) e.referralSourceOther = 'Please specify referral source.';
  }
  if (step === 1) {
    [['fullName','Full name'],['idPassport','ID / Passport number'],['gender','Gender'],['email','Email address'],['phoneNumber','Phone number'],['country','Country'],['fullAddress','Full address'],['placeOfBirth','Place of birth'],['nationality','Nationality'],['race','Race'],['religion','Religion'],['maritalStatus','Marital status']].forEach(([f, l]) => {
      if (typeof form[f] === 'string' && isBlank(form[f])) e[f] = `${l} is required.`;
    });
  }
  if (step === 2) {
    if (isBlank(form.emergencyName)) e.emergencyName = 'Emergency contact name is required.';
    if (isBlank(form.emergencyRelationship)) e.emergencyRelationship = 'Relationship is required.';
    if (isBlank(form.emergencyPhone)) e.emergencyPhone = 'Emergency contact phone is required.';
  }
  if (step === 3) {
    const d = form.documents, eq = form.entryQualificationType;
    if (!d.identityDocument) e.identityDocument = 'Identity document is required.';
    if (!d.passportPhoto) e.passportPhoto = 'Passport size photo is required.';
    if (eq === 'Academic Qualification') { if (!d.transcript) e.transcript = 'Highest academic transcript is required.'; if (!d.certificate) e.certificate = 'Highest academic certificate is required.'; }
    if (eq === 'APEL') { if (!d.apelCertificate) e.apelCertificate = 'APEL certificate is required.'; if (!d.cvResume) e.cvResume = 'CV / Resume is required for APEL applications.'; }
    if (eq === 'SKM / TVET / Skills Qualification') { if (!d.certificate) e.certificate = 'Relevant skills certificate is required.'; }
    if (eq === 'Professional / Other Qualification') { if (!d.otherSupportingDocument) e.otherSupportingDocument = 'Supporting document is required.'; if (!d.cvResume) e.cvResume = 'CV / Resume is required for this qualification type.'; }
  }
  if (step === 4) {
    if (!form.paymentArrangement) e.paymentArrangement = 'Please select payment arrangement.';
    if (form.paymentArrangement === 'Installment Plan' && isBlank(form.installmentFrequency)) e.installmentFrequency = 'Please select installment frequency.';
    if (!form.paymentSource) e.paymentSource = 'Please select payment source.';
    if (form.paymentSource === 'Other' && isBlank(form.paymentSourceOther)) e.paymentSourceOther = 'Please specify the payment source.';
  }
  if (step === 5 && !form.declarationAccepted) e.declarationAccepted = 'Please confirm the declaration before submitting.';
  return e;
}

/* ─── Main component ─── */

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ ...INITIAL_FORM, documents: { ...INITIAL_FORM.documents } });

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const update = useCallback((key, value) => {
    setForm(prev => {
      if (key === 'levelOfStudy') return { ...prev, levelOfStudy: value, programme: '' };
      return { ...prev, [key]: value };
    });
    setErrors(prev => {
      const next = { ...prev, [key]: '' };
      if (key === 'levelOfStudy') next.programme = '';
      return next;
    });
  }, []);

  const updateDoc = useCallback((key, file) => {
    setForm(prev => ({ ...prev, documents: { ...prev.documents, [key]: file } }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  }, []);

  function tryValidate() {
    const e = validate(currentStep, form);
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (!tryValidate()) return;
    setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function prevStep() {
    setCurrentStep(s => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  async function handleSubmit() {
    if (!tryValidate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  }
  function reset() {
    setForm({ ...INITIAL_FORM, documents: { ...INITIAL_FORM.documents } });
    setCurrentStep(0);
    setSubmitted(false);
    setErrors({});
  }

  /* ─── Success screen ─── */
  if (submitted) {
    const { Icon } = STEPS[5];
    return (
      <div className="container">
        <div className="card fade-in">
          <div className="success-card">
            <div className="success-icon"><Icon /></div>
            <h1 className="success-title">Application Submitted</h1>
            <p className="success-msg">Thank you. Your application has been received and is currently being processed by Innovative University College.</p>
            <div className="success-detail">
              <p><span className="sv-label">Reference No:</span> IUC-DEMO-2026-001</p>
              <p><span className="sv-label">Acknowledgement Email:</span> A confirmation email can be sent to the applicant automatically after submission.</p>
              <p><span className="sv-label">Document Storage:</span> Uploaded files can be saved into the student folder in Google Drive and linked back to Google Sheets.</p>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 24, padding: '16px 24px' }} onClick={reset}>Submit Another Response</button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Form ─── */
  const step = STEPS[currentStep];
  const StepIcon = step.Icon;
  const sections = [ProgrammeSection, StudentSection, EmergencySection, DocumentsSection, PaymentSection, ReviewSection];
  const CurrentSection = sections[currentStep];

  return (
    <div className="container">
      <div className="layout">
        {/* Sidebar */}
        <div className="card card--sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo-row">
              <div className="sidebar-logo-icon"><BuildingIcon /></div>
              <div>
                <p className="sidebar-logo-text">Innovative University College</p>
                <p className="sidebar-logo-sub">Replace the logoUrl value with your official logo path.</p>
              </div>
            </div>
            <h2 className="sidebar-title">IUC Admission Form</h2>
            <p className="sidebar-desc">Application for Admission</p>
          </div>
          <div className="progress-area">
            <div className="progress-labels"><span>Progress</span><span>{currentStep + 1} / {STEPS.length}</span></div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="step-list">
            {STEPS.map((s, i) => {
              const cls = i === currentStep ? 'step-item--active' : i < currentStep ? 'step-item--done' : '';
              const SIcon = s.Icon;
              return (
                <div key={s.key} className={`step-item ${cls}`}>
                  <div className="step-icon-wrap"><SIcon /></div>
                  <div><p className="step-label">Step {i + 1}</p><p className="step-sublabel">{s.title}</p></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main */}
        <div className="card fade-in" key={currentStep}>
          <div className="main-header">
            <div className="main-header-icon"><StepIcon /></div>
            <div><h2 className="main-title">{step.title}</h2><p className="main-desc">Please complete all required information before continuing.</p></div>
          </div>
          <div className="main-body">
            <CurrentSection form={form} errors={errors} update={update} updateDoc={updateDoc} />
            <div className="footer-actions">
              <button className="btn btn-outline" onClick={prevStep} disabled={currentStep === 0 || loading}>Back</button>
              {currentStep < STEPS.length - 1
                ? <button className="btn btn-primary" onClick={nextStep}>Continue</button>
                : <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Submitting...' : 'Submit Application'}</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
