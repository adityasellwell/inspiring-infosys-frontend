import React, { useState } from 'react';
import {
  FiCalendar, FiUser, FiDollarSign, FiClock, FiCheckCircle,
  FiAlertCircle, FiX, FiFileText, FiTrash2
} from 'react-icons/fi';
import { FaCalculator } from 'react-icons/fa';
import { employeesApi } from '../../../api/api';
import { useToast } from '../../../components/common/ToastContext';
import { formatEmpId } from './empUtils';

export default function AttendanceLogsTab({ empAttendanceList = [], employeesList = [], empLeavesList = [], onRefreshAttendance }) {
  const toast = useToast();
  const [deletingId, setDeletingId] = useState(null);
  const [cleaningDuplicates, setCleaningDuplicates] = useState(false);

  // Filters
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [selectedEmpIdFilter, setSelectedEmpIdFilter] = useState('All');

  // Year options generator
  const getYearOptions = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let y = currentYear + 2; y >= currentYear - 3; y--) {
      years.push(y);
    }
    return years;
  };

  // Employee Salary & Leave Calculation Modal State
  const [calcModalEmp, setCalcModalEmp] = useState(null);
  const [calcMonthYear, setCalcMonthYear] = useState('2026-09');
  const [issuingSlip, setIssuingSlip] = useState(false);

  // Dynamic Month options generator (Supports 2026, 2027, 2028 and beyond)
  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      options.push({ val, label });
    }
    return options;
  };

  const monthOptions = getMonthOptions();

  // Filtered Attendance List
  const filteredAttendance = (empAttendanceList || []).filter(att => {
    if (!att.date) return false;
    const attDate = new Date(att.date);
    if (selectedYear !== 'All') {
      if (attDate.getFullYear() !== parseInt(selectedYear, 10)) {
        return false;
      }
    }
    if (selectedMonth !== 'All') {
      const [y, m] = selectedMonth.split('-');
      if (attDate.getFullYear() !== parseInt(y, 10) || (attDate.getMonth() + 1) !== parseInt(m, 10)) {
        return false;
      }
    }
    if (selectedDateFilter) {
      const filterD = new Date(selectedDateFilter);
      if (attDate.getFullYear() !== filterD.getFullYear() || attDate.getMonth() !== filterD.getMonth() || attDate.getDate() !== filterD.getDate()) {
        return false;
      }
    }
    if (selectedEmpIdFilter !== 'All') {
      if (String(att.employeeId) !== String(selectedEmpIdFilter) && String(att.employee?.id) !== String(selectedEmpIdFilter)) {
        return false;
      }
    }
    return true;
  });

  // Calculate Salary & Leave Breakdown for selected employee & month
  const calculateEmployeeSalaryAndLeaves = (emp, monthYearStr) => {
    if (!emp) return null;
    const [yearStr, monthStr] = monthYearStr.split('-');
    const year = parseInt(yearStr, 10);
    const monthIndex = parseInt(monthStr, 10) - 1;

    // Total days in selected month
    const totalDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // Base salary (default ₹50,000 if not specified)
    const baseSalary = parseFloat(emp.salary) || 50000;
    const perDayRate = baseSalary / totalDaysInMonth;

    // Filter employee's attendance in selected month
    const empAtts = (empAttendanceList || []).filter(a => {
      const empMatch = String(a.employeeId) === String(emp.id) || String(a.employee?.id) === String(emp.id);
      if (!empMatch || !a.date) return false;
      const d = new Date(a.date);
      return d.getFullYear() === year && d.getMonth() === monthIndex;
    });

    const presentDays = empAtts.length;

    // Filter approved leaves in selected month
    const empLeaves = (empLeavesList || []).filter(l => {
      const empMatch = String(l.employeeId) === String(emp.id) || String(l.employee?.id) === String(emp.id);
      if (!empMatch || l.status !== 'Approved' || !l.startDate) return false;
      const d = new Date(l.startDate);
      return d.getFullYear() === year && d.getMonth() === monthIndex;
    });

    const approvedLeaveDays = empLeaves.reduce((acc, l) => {
      const start = new Date(l.startDate);
      const end = l.endDate ? new Date(l.endDate) : start;
      const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
      return acc + diffDays;
    }, 0);

    // Total unapproved / absent days
    const totalAbsentDays = Math.max(0, totalDaysInMonth - presentDays - approvedLeaveDays);

    // Rule: 1 Leave is FREE (0 deduction). Deduction applies ONLY for extra leaves beyond 1.
    const totalLeavesTaken = totalAbsentDays + approvedLeaveDays;
    const freeAllowedLeaves = 1;
    const extraDeductibleLeaves = Math.max(0, totalLeavesTaken - freeAllowedLeaves);

    const deductionAmount = Math.round(extraDeductibleLeaves * perDayRate);
    const calculatedNetSalary = Math.max(0, Math.round(baseSalary - deductionAmount));

    return {
      totalDaysInMonth,
      baseSalary,
      perDayRate,
      presentDays,
      approvedLeaveDays,
      totalAbsentDays,
      totalLeavesTaken,
      freeAllowedLeaves,
      extraDeductibleLeaves,
      deductionAmount,
      calculatedNetSalary
    };
  };

  // Issue calculated salary slip
  const handleIssueCalculatedSlip = async () => {
    if (!calcModalEmp) return;
    const calc = calculateEmployeeSalaryAndLeaves(calcModalEmp, calcMonthYear);
    if (!calc) return;

    const [yearStr, monthStr] = calcMonthYear.split('-');
    const dateObj = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
    const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' });

    setIssuingSlip(true);
    try {
      const payload = {
        employeeId: calcModalEmp.id,
        month: monthName,
        year: parseInt(yearStr, 10),
        basicPay: Math.round(calc.baseSalary * 0.5),
        hra: Math.round(calc.baseSalary * 0.3),
        allowances: Math.round(calc.baseSalary * 0.2),
        deductions: calc.deductionAmount
      };

      const res = await employeesApi.issueSalarySlip(payload);
      if (res.success) {
        toast.success(`Salary slip issued for ${calcModalEmp.name} (${monthName} ${yearStr})! Net Salary: ₹${calc.calculatedNetSalary.toLocaleString('en-IN')}`);
        setCalcModalEmp(null);
      } else {
        toast.error(res.message || 'Failed to issue salary slip');
      }
    } catch (err) {
      toast.error('Failed to issue salary slip');
    } finally {
      setIssuingSlip(false);
    }
  };

  const currentCalc = calcModalEmp ? calculateEmployeeSalaryAndLeaves(calcModalEmp, calcMonthYear) : null;

  // Safe time display helper
  const formatTimeDisplay = (val) => {
    if (!val) return '-';
    if (typeof val === 'string' && (val.includes('AM') || val.includes('PM'))) {
      return val;
    }
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return String(val);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (err) {
      return String(val);
    }
  };

  // Safe date display helper
  const formatDateDisplay = (val) => {
    if (!val) return '-';
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return String(val);
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (err) {
      return String(val);
    }
  };

  // Single Attendance Record Deletion Handler
  const handleDeleteLog = async (attId) => {
    if (!attId) return;
    if (!window.confirm('Are you sure you want to delete this attendance record?')) return;
    setDeletingId(attId);
    try {
      const res = await employeesApi.deleteAttendance(attId);
      if (res.success) {
        toast.success(res.message || 'Attendance record deleted successfully!');
        if (onRefreshAttendance) onRefreshAttendance();
      } else {
        toast.error(res.message || 'Failed to delete record');
      }
    } catch (err) {
      toast.error('Failed to delete attendance record');
    } finally {
      setDeletingId(null);
    }
  };

  // Clean Duplicate Logs Handler
  const handleCleanDuplicates = async () => {
    if (!window.confirm('Are you sure you want to clean duplicate attendance logs? Only 1 earliest clock-in record per employee per day will be kept.')) return;
    setCleaningDuplicates(true);
    try {
      const res = await employeesApi.cleanDuplicateAttendance();
      if (res.success) {
        toast.success(res.message || `Cleaned ${res.count || 0} duplicate attendance logs!`);
        if (onRefreshAttendance) onRefreshAttendance();
      } else {
        toast.error(res.message || 'Failed to clean duplicate logs');
      }
    } catch (err) {
      toast.error('Failed to clean duplicate logs');
    } finally {
      setCleaningDuplicates(false);
    }
  };

  return (
    <div className="admin-attendance-tab-pane">
      <div className="admin-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>Employees Attendance & Salary Calculator</h1>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>Track month-wise attendance logs and calculate net salary with automatic 1-free-leave deduction policy.</p>
        </div>
        <button
          type="button"
          onClick={handleCleanDuplicates}
          disabled={cleaningDuplicates}
          style={{
            padding: '0.5rem 0.95rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            color: '#dc2626',
            fontWeight: '700',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            opacity: cleaningDuplicates ? 0.7 : 1
          }}
        >
          <FiTrash2 size={14} /> {cleaningDuplicates ? 'Cleaning Duplicates...' : 'Clean Duplicate Logs'}
        </button>
      </div>

      {/* Year-Wise, Month-Wise, Calendar Date & Employee Filter Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', background: '#fff', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiCalendar style={{ color: '#0284c7' }} />
          <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#334155', whiteSpace: 'nowrap' }}>Year:</span>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', background: '#f8fafc' }}
          >
            <option value="All">All Years</option>
            {getYearOptions().map(yr => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiCalendar style={{ color: '#0284c7' }} />
          <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#334155', whiteSpace: 'nowrap' }}>Month:</span>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', background: '#f8fafc' }}
          >
            <option value="All">All Months (Real-time Logs)</option>
            {monthOptions.map(opt => (
              <option key={opt.val} value={opt.val}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiCalendar style={{ color: '#0284c7' }} />
          <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#334155', whiteSpace: 'nowrap' }}>Date:</span>
          <input
            type="date"
            value={selectedDateFilter}
            onChange={e => setSelectedDateFilter(e.target.value)}
            style={{ padding: '0.4rem 0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', background: '#f8fafc', cursor: 'pointer' }}
          />
          {selectedDateFilter && (
            <button
              type="button"
              onClick={() => setSelectedDateFilter('')}
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f1f5f9', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}
            >
              Clear Date
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiUser style={{ color: '#0284c7' }} />
          <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#334155', whiteSpace: 'nowrap' }}>Employee:</span>
          <select
            value={selectedEmpIdFilter}
            onChange={e => setSelectedEmpIdFilter(e.target.value)}
            style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', background: '#f8fafc' }}
          >
            <option value="All">All Employees</option>
            {(employeesList || []).map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({formatEmpId(emp.empId, emp.id)})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Logs Table */}
      <div className="admin-card" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Working Duration</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    <FiAlertCircle size={28} style={{ color: '#94a3b8', marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0, fontWeight: '600' }}>No attendance records found for the selected filter.</p>
                  </td>
                </tr>
              ) : (
                filteredAttendance.map(att => {
                  let durationStr = att.workDuration || att.workingDuration || '-';
                  if (att.checkIn && att.checkOut) {
                    const dIn = new Date(att.checkIn);
                    const dOut = new Date(att.checkOut);
                    if (!isNaN(dIn.getTime()) && !isNaN(dOut.getTime())) {
                      const diffMs = dOut - dIn;
                      if (diffMs > 0) {
                        const hours = Math.floor(diffMs / (1000 * 60 * 60));
                        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                        durationStr = `${hours}h ${mins}m`;
                      }
                    }
                  } else if (att.checkIn && !att.checkOut) {
                    durationStr = 'Active Working';
                  }

                  const matchedEmp = (employeesList || []).find(e => String(e.id) === String(att.employeeId) || String(e.id) === String(att.employee?.id)) || att.employee;

                  return (
                    <tr key={att.id}>
                      <td>
                        <strong>{att.employee?.name || matchedEmp?.name || 'Employee'}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {formatEmpId(att.employee?.empId || matchedEmp?.empId, att.employee?.id || matchedEmp?.id)} • {att.employee?.department || matchedEmp?.department}
                        </div>
                      </td>
                      <td>{formatDateDisplay(att.date)}</td>
                      <td>
                        {att.checkIn ? (
                          <span style={{ color: '#16a34a', fontWeight: '700' }}>
                            {formatTimeDisplay(att.checkIn)}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>-</span>
                        )}
                      </td>
                      <td>
                        {att.checkOut ? (
                          <span style={{ color: '#dc2626', fontWeight: '700' }}>
                            {formatTimeDisplay(att.checkOut)}
                          </span>
                        ) : (
                          <span style={{ color: '#0284c7', fontWeight: '600' }}>Clocked In</span>
                        )}
                      </td>
                      <td>
                        <strong style={{ color: '#0f172a' }}>{durationStr}</strong>
                      </td>
                      <td>
                        <span className={`status-badge ${
                          att.checkOut ? 'status-active' : att.checkIn ? 'status-pending' : 'status-inactive'
                        }`}>
                          {att.status || (att.checkOut ? 'Present' : 'Clocked In')}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                          <button
                            type="button"
                            className="btn-orange"
                            style={{ padding: '0.28rem 0.65rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => {
                              setCalcModalEmp(matchedEmp || { id: att.employeeId, name: att.employee?.name || 'Employee', salary: 50000 });
                            }}
                          >
                            <FaCalculator size={13} /> Calculate Salary & Leaves
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === att.id}
                            style={{
                              padding: '0.28rem 0.6rem',
                              fontSize: '0.78rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              borderRadius: '6px',
                              border: '1px solid #fca5a5',
                              background: '#fef2f2',
                              color: '#dc2626',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              opacity: deletingId === att.id ? 0.6 : 1
                            }}
                            onClick={() => handleDeleteLog(att.id)}
                            title="Delete attendance log"
                          >
                            <FiTrash2 size={13} /> {deletingId === att.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── EMPLOYEE MONTHLY SALARY & LEAVE CALCULATION MODAL ── */}
      {calcModalEmp && currentCalc && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '680px', borderRadius: '16px', padding: '1.75rem' }}>
            <div className="admin-modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 className="admin-modal-title" style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                  📊 Monthly Attendance & Salary Breakdown
                </h3>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                  Calculating net payable salary for <strong>{calcModalEmp.name}</strong> ({formatEmpId(calcModalEmp.empId, calcModalEmp.id)})
                </p>
              </div>
              <button type="button" className="admin-modal-close-btn" onClick={() => setCalcModalEmp(null)}>
                <FiX size={18} />
              </button>
            </div>

            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Select Calculation Month */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: '700', fontSize: '0.88rem', color: '#334155' }}>Calculation Month:</span>
                <select
                  value={calcMonthYear}
                  onChange={e => setCalcMonthYear(e.target.value)}
                  style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: '700', color: '#0284c7', background: '#ffffff' }}
                >
                  {monthOptions.map(opt => (
                    <option key={opt.val} value={opt.val}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Policy Rule Alert */}
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '0.85rem 1rem', fontSize: '0.84rem', color: '#1e40af' }}>
                <strong>📌 Company Leave Policy:</strong> 1 Leave per month is <strong>FREE (No salary deduction)</strong>. Salary deduction applies only for extra unapproved leaves beyond 1 day.
              </div>

              {/* Breakdown Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
                <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Monthly Base Salary</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginTop: '0.2rem' }}>₹{currentCalc.baseSalary.toLocaleString('en-IN')}</div>
                </div>

                <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Days in Month</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0284c7', marginTop: '0.2rem' }}>{currentCalc.totalDaysInMonth} Days</div>
                </div>

                <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Per-Day Rate</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#334155', marginTop: '0.2rem' }}>₹{Math.round(currentCalc.perDayRate).toLocaleString('en-IN')}/day</div>
                </div>
              </div>

              {/* Attendance & Leave Table Calculation */}
              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.65rem 1rem', color: '#475569', fontWeight: '600' }}>Present / Clocked-In Days</td>
                      <td style={{ padding: '0.65rem 1rem', textAlign: 'right', fontWeight: '800', color: '#16a34a' }}>{currentCalc.presentDays} Days</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.65rem 1rem', color: '#475569', fontWeight: '600' }}>Approved Leave Days</td>
                      <td style={{ padding: '0.65rem 1rem', textAlign: 'right', fontWeight: '800', color: '#0284c7' }}>{currentCalc.approvedLeaveDays} Days</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.65rem 1rem', color: '#475569', fontWeight: '600' }}>Total Unapproved / Absent Days</td>
                      <td style={{ padding: '0.65rem 1rem', textAlign: 'right', fontWeight: '800', color: '#dc2626' }}>{currentCalc.totalAbsentDays} Days</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                      <td style={{ padding: '0.65rem 1rem', color: '#334155', fontWeight: '700' }}>Free Allowed Leaves Policy</td>
                      <td style={{ padding: '0.65rem 1rem', textAlign: 'right', fontWeight: '800', color: '#16a34a' }}>1 Day Free (₹0)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fff5f5' }}>
                      <td style={{ padding: '0.65rem 1rem', color: '#b91c1c', fontWeight: '700' }}>Deductible Extra Leaves (Beyond 1 Free)</td>
                      <td style={{ padding: '0.65rem 1rem', textAlign: 'right', fontWeight: '800', color: '#dc2626' }}>{currentCalc.extraDeductibleLeaves} Days</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fff5f5' }}>
                      <td style={{ padding: '0.65rem 1rem', color: '#b91c1c', fontWeight: '700' }}>Total Salary Deduction Amount</td>
                      <td style={{ padding: '0.65rem 1rem', textAlign: 'right', fontWeight: '800', color: '#dc2626' }}>- ₹{currentCalc.deductionAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr style={{ background: '#f0fdf4' }}>
                      <td style={{ padding: '0.85rem 1rem', color: '#166534', fontWeight: '800', fontSize: '0.98rem' }}>Final Net Payable Monthly Salary</td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: '900', color: '#15803d', fontSize: '1.2rem' }}>₹{currentCalc.calculatedNetSalary.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="admin-modal-footer" style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={() => setCalcModalEmp(null)}>
                Close
              </button>
              <button
                type="button"
                className="btn-orange"
                disabled={issuingSlip}
                onClick={handleIssueCalculatedSlip}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FiDollarSign /> {issuingSlip ? 'Generating Slip...' : 'Issue Calculated Salary Slip'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
