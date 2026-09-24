import React, { useState, useEffect } from 'react';
import { FiPrinter, FiX, FiFileText, FiCalendar, FiEdit3, FiRotateCcw, FiCheck } from 'react-icons/fi';
import { formatEmpId } from './empUtils';
import './ExperienceLetter.css';

function ExperienceLetter({ employee, onClose, isReadOnly = false }) {
  if (!employee) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const parseLocalDate = (dateString) => {
    if (!dateString) return null;
    const clean = String(dateString).split('T')[0];
    const parts = clean.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date(dateString);
  };

  const getInitialJoinDate = () => {
    if (employee.joinDate) {
      const parsedIso = new Date(employee.joinDate).toISOString().split('T')[0];
      if (parsedIso !== todayStr) {
        return parsedIso;
      }
    }
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return oneYearAgo.toISOString().split('T')[0];
  };

  const [joiningDate, setJoiningDate] = useState(getInitialJoinDate());
  const [relievingDate, setRelievingDate] = useState(todayStr);
  const [isEditMode, setIsEditMode] = useState(false);

  const formatDateDisplay = (dateString) => {
    const d = parseLocalDate(dateString);
    if (!d || isNaN(d.getTime())) return dateString || '';
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };

  const formatDateLong = (dateString) => {
    const d = parseLocalDate(dateString);
    if (!d || isNaN(d.getTime())) return dateString || '';
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formattedJoiningDate = formatDateDisplay(joiningDate);
  const formattedJoiningDateLong = formatDateLong(joiningDate);
  const formattedRelievingDate = formatDateDisplay(relievingDate);
  const formattedRelievingDateLong = formatDateLong(relievingDate);

  const getInitialRefNo = () => {
    const issueDateObj = parseLocalDate(relievingDate) || new Date();
    const yearShort = String(issueDateObj.getFullYear()).slice(-2);
    const nextYearShort = String(issueDateObj.getFullYear() + 1).slice(-2);
    const finYearStr = `${yearShort}-${nextYearShort}`;
    const monthNameStr = issueDateObj.toLocaleDateString('en-US', { month: 'long' });

    if (employee.empId && employee.empId.includes('/')) {
      return `EXP/${employee.empId}`;
    }
    const rawId = formatEmpId(employee.empId, employee.id);
    const cleanNum = rawId.replace(/\D/g, '') || String(employee.id || 1);
    const paddedNum = cleanNum.padStart(3, '0');
    return `${finYearStr}/EXP/${monthNameStr}/${paddedNum}`;
  };

  // Editable state fields
  const [refNo, setRefNo] = useState(getInitialRefNo());
  const [employeeName, setEmployeeName] = useState(employee.name || '');
  const [empIdText, setEmpIdText] = useState(formatEmpId(employee.empId, employee.id));
  const [designationText, setDesignationText] = useState(employee.designation || 'Software Engineer');
  const [departmentText, setDepartmentText] = useState(employee.department || 'IT & Development');
  const [subjectText, setSubjectText] = useState('EXPERIENCE CERTIFICATE & WORK SERVICE RECORD');

  const [para1, setPara1] = useState(
    `This is to certify that ${employeeName ? `Mr./Ms. ${employeeName}` : 'the employee'} was employed with INSPIRING INFOSYS from ${formattedJoiningDateLong} to ${formattedRelievingDateLong}.`
  );

  const [para2, setPara2] = useState(
    `During the tenure of employment, ${employeeName ? `Mr./Ms. ${employeeName}` : 'the employee'} held the designation of ${designationText} in the ${departmentText} department and fulfilled assigned duties with high professionalism, responsibility, and diligence.`
  );

  const [para3, setPara3] = useState(
    `During this service period, we found ${employeeName ? `Mr./Ms. ${employeeName}` : 'the employee'} to be self-motivated, honest, hardworking, and result-oriented. Professional conduct, technical skills, and commitment towards organizational objectives were exemplary.`
  );

  const [para4, setPara4] = useState(
    `We extend our sincere gratitude for the valuable contributions made to INSPIRING INFOSYS and wish ${employeeName ? `Mr./Ms. ${employeeName}` : 'the employee'} all the best and continued success in all future professional endeavors.`
  );

  const [signatoryTitle, setSignatoryTitle] = useState('Authorized Signatory / HR Director');

  useEffect(() => {
    const prefixName = employeeName ? `Mr./Ms. ${employeeName}` : 'the employee';
    setPara1(`This is to certify that ${prefixName} was employed with INSPIRING INFOSYS from ${formattedJoiningDateLong} to ${formattedRelievingDateLong}.`);
    setPara2(`During the tenure of employment, ${prefixName} held the designation of ${designationText} in the ${departmentText} department and fulfilled assigned duties with high professionalism, responsibility, and diligence.`);
    setPara3(`During this service period, we found ${prefixName} to be self-motivated, honest, hardworking, and result-oriented. Professional conduct, technical skills, and commitment towards organizational objectives were exemplary.`);
    setPara4(`We extend our sincere gratitude for the valuable contributions made to INSPIRING INFOSYS and wish ${prefixName} all the best and continued success in all future professional endeavors.`);
  }, [joiningDate, relievingDate, designationText, departmentText, employeeName]);

  const handleResetDefaults = () => {
    const prefixName = employee.name ? `Mr./Ms. ${employee.name}` : 'the employee';
    setRefNo(getInitialRefNo());
    setEmployeeName(employee.name || '');
    setEmpIdText(formatEmpId(employee.empId, employee.id));
    setDesignationText(employee.designation || 'Software Engineer');
    setDepartmentText(employee.department || 'IT & Development');
    setSubjectText('EXPERIENCE CERTIFICATE & WORK SERVICE RECORD');
    setSignatoryTitle('Authorized Signatory / HR Director');
    setPara1(`This is to certify that ${prefixName} was employed with INSPIRING INFOSYS from ${formattedJoiningDateLong} to ${formattedRelievingDateLong}.`);
    setPara2(`During the tenure of employment, ${prefixName} held the designation of ${employee.designation || 'Software Engineer'} in the ${employee.department || 'IT & Development'} department and fulfilled assigned duties with high professionalism, responsibility, and diligence.`);
    setPara3(`During this service period, we found ${prefixName} to be self-motivated, honest, hardworking, and result-oriented. Professional conduct, technical skills, and commitment towards organizational objectives were exemplary.`);
    setPara4(`We extend our sincere gratitude for the valuable contributions made to INSPIRING INFOSYS and wish ${prefixName} all the best and continued success in all future professional endeavors.`);
  };

  const handlePrint = () => {
    setIsEditMode(false);
    setTimeout(() => {
      const wrapper = document.querySelector('.experience-letter-document-wrapper');
      if (!wrapper) { window.print(); return; }

      const printHTML = wrapper.innerHTML;
      const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
        .map(el => el.outerHTML).join('\n');

      const existing = document.getElementById('__experience-print-frame__');
      if (existing) existing.remove();
      const iframe = document.createElement('iframe');
      iframe.id = '__experience-print-frame__';
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;';
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Experience Letter – ${employeeName}</title>
  ${styles}
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box !important; }
    html, body { margin: 0 !important; padding: 0 !important; background: #ffffff; }
    .experience-letter-document-wrapper { display: block !important; width: 210mm !important; margin: 0 !important; padding: 0 !important; transform: none !important; background: #ffffff !important; }
    .experience-letter-page { position: relative !important; display: flex !important; flex-direction: column !important; width: 210mm !important; min-height: 297mm !important; height: auto !important; padding: 0 12mm 12mm 12mm !important; box-sizing: border-box !important; background: #ffffff !important; color: #000000 !important; overflow: visible !important; box-shadow: none !important; border-radius: 0 !important; margin: 0 !important; transform: none !important; }
    .official-page-footer { margin-top: auto !important; flex-shrink: 0 !important; width: calc(100% + 24mm) !important; margin-left: -12mm !important; margin-right: -12mm !important; margin-bottom: -12mm !important; }
    .no-print { display: none !important; }
  </style>
</head>
<body>
  <div class="experience-letter-document-wrapper">${printHTML}</div>
</body>
</html>`);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (e) { window.print(); }
        setTimeout(() => { if (iframe.parentNode) iframe.parentNode.removeChild(iframe); }, 2000);
      }, 800);
    }, 150);
  };

  return (
    <div className="experience-letter-modal-overlay" onClick={onClose}>
      <div className="experience-letter-modal-card" onClick={(e) => e.stopPropagation()}>

        {/* Modal Header Bar */}
        <div className="experience-letter-modal-header no-print">
          <div className="header-top-row">
            <div className="modal-header-title">
              <FiFileText size={20} className="modal-icon" />
              <span>Official Experience Letter – <strong>{employeeName}</strong></span>
            </div>

            <div className="modal-header-actions">
              {!isReadOnly && (
                <button
                  type="button"
                  className={`btn-toggle-edit ${isEditMode ? 'active' : ''}`}
                  onClick={() => setIsEditMode(!isEditMode)}
                  title={isEditMode ? 'Finish Editing' : 'Click text on letter to edit directly'}
                >
                  {isEditMode ? <><FiCheck size={14} /> Done Editing</> : <><FiEdit3 size={14} /> Edit Text</>}
                </button>
              )}

              <button
                type="button"
                className="btn-modal-print"
                onClick={handlePrint}
                title="Print or Save as PDF"
              >
                <FiPrinter size={16} /> Print / Save PDF
              </button>

              <button
                type="button"
                className="btn-modal-close"
                onClick={onClose}
                title="Close Modal"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {!isReadOnly && (
            <div className="modal-header-controls">

              <div className="control-group">
                <label><FiCalendar size={12} /> Relieving Date:</label>
                <input
                  type="date"
                  value={relievingDate}
                  onChange={(e) => setRelievingDate(e.target.value)}
                  className="date-picker-input"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="experience-letter-modal-body">
          <div className="experience-letter-document-wrapper">

            {isEditMode && (
              <div className="edit-banner-info no-print">
                <FiEdit3 size={14} /> <strong>Inline Edit Mode Active:</strong> Click on any text inside the experience letter to edit employee details, designation, paragraphs, or titles directly!
              </div>
            )}

            {/* ════════════════════════ PAGE: EXPERIENCE LETTER ════════════════════════ */}
            <div className={`experience-letter-page ${isEditMode ? 'editable-page-active' : ''}`}>

              {/* Top Blue Header Banner */}
              <div className="doc-top-blue-header">
                <svg className="header-wave-svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="expBlueHeaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#004b99" />
                      <stop offset="50%" stopColor="#0077e6" />
                      <stop offset="100%" stopColor="#00a8ff" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,0 L 1000,0 L 1000,95 C 650,88 350,15 0,45 Z" fill="url(#expBlueHeaderGrad)" />
                </svg>
                <div className="header-logo-container">
                  <img src="/images/logo2.webp" alt="Inspiring Infosys Logo" className="header-banner-logo" />
                </div>
              </div>

              {/* Date & Ref Row */}
              <div className="doc-meta-row">
                <span className="doc-ref">
                  Ref No: <strong
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setRefNo(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{refNo}</strong>
                </span>
                <span className="doc-date">Date: <strong>{formattedRelievingDate}</strong></span>
              </div>

              {/* Certificate Heading */}
              <div className="doc-subject" style={{ textAlign: 'center', marginTop: '15px', marginBottom: '25px' }}>
                <h2
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setSubjectText(e.target.innerText)}
                  className={`certificate-title ${isEditMode ? 'editable-field' : ''}`}
                >
                  {subjectText}
                </h2>
              </div>

              {/* Employee Summary Highlight Card */}
              <div className="experience-highlight-box">
                <div className="highlight-item">
                  <span>Employee Name:</span> <strong
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setEmployeeName(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{employeeName}</strong>
                </div>
                <div className="highlight-item">
                  <span>Employee ID:</span> <strong
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setEmpIdText(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{empIdText}</strong>
                </div>
                <div className="highlight-item">
                  <span>Designation:</span> <strong
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setDesignationText(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{designationText}</strong>
                </div>
                <div className="highlight-item">
                  <span>Department:</span> <strong
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => setDepartmentText(e.target.innerText)}
                    className={isEditMode ? 'editable-field' : ''}
                  >{departmentText}</strong>
                </div>
                <div className="highlight-item full-width">
                  <span>Service Period:</span> <strong>{formattedJoiningDate} to {formattedRelievingDate}</strong>
                </div>
              </div>

              {/* Body Paragraphs */}
              <div className="doc-paragraphs">
                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setPara1(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {para1}
                </p>

                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setPara2(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {para2}
                </p>

                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setPara3(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {para3}
                </p>

                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setPara4(e.target.innerText)}
                  className={isEditMode ? 'editable-field' : ''}
                >
                  {para4}
                </p>
              </div>

              {/* Signatures & Stamp */}
              <div className="experience-signatures-row">
                <div className="experience-sig-col">
                  <p className="sig-heading">Issued To</p>
                  <div className="dots-line">……………………………………………</div>
                  <p className="sig-sub"><strong>{employeeName}</strong></p>
                </div>

                <div className="experience-sig-col right-col">
                  <p className="sig-heading">For <strong>Inspiring Infosys</strong></p>
                  <div className="stamp-wrapper inline-stamp">
                    <img src="/images/company-stamp.png" alt="Inspiring Infosys Stamp & Signature" className="official-stamp-img" />
                  </div>
                  <p className="sig-sub">
                    <strong
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => setSignatoryTitle(e.target.innerText)}
                      className={isEditMode ? 'editable-field' : ''}
                    >{signatoryTitle}</strong>
                  </p>
                </div>
              </div>

              {/* Official Page Footer */}
              <div className="official-page-footer">
                <p className="footer-address">
                  203 second floor’ DJ Arcade Behaind Dhuri Archad, near Navghar, next to Rishikesh Hotel, Vasai West, Mumbai, Maharashtra 401202 Phone: +91(022) 8444040514
                </p>
                <div className="footer-color-bar">
                  <div className="bar-left">www.inspiringinfosys.com</div>
                  <div className="bar-right">Email: info@inspiringinfosys.com</div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ExperienceLetter;
