/**
 * Employee ID Formatting & ID Generation Utilities
 * Standalone module to avoid circular dependency cycles in Admin components
 */

export const formatEmpId = (empId, id) => {
  const raw = String(empId || id || '').trim();
  if (!raw) return 'INS001';

  if (/^INS-?\d+$/i.test(raw)) {
    const numMatch = raw.match(/\d+/);
    if (numMatch) {
      return `INS${String(parseInt(numMatch[0], 10)).padStart(3, '0')}`;
    }
  }

  const match = raw.match(/\d+/);
  if (match && (/^emp\d+$/i.test(raw) || /^emp-\d+$/i.test(raw) || /^insi\d+$/i.test(raw) || /^\d+$/.test(raw))) {
    const num = parseInt(match[0], 10);
    if (!isNaN(num)) {
      return `INS${String(num).padStart(3, '0')}`;
    }
  }

  return raw.toUpperCase();
};

export const generateNextEmpId = (list = []) => {
  let maxNum = 0;
  (list || []).forEach(emp => {
    const raw = String(emp.empId || emp.id || '');
    const match = raw.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });
  return `INS${String(maxNum + 1).padStart(3, '0')}`;
};
