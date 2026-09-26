import html2pdf from 'html2pdf.js';

/**
 * Detect if the current device is mobile (phone/tablet)
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (window.innerWidth <= 768);
};

/**
 * Generate PDF from letter pages on mobile, or trigger window.print() on desktop.
 *
 * @param {Object} opts
 * @param {string} opts.fileName        – PDF file name (without .pdf)
 * @param {string} opts.pageSelector    – CSS selector for the A4 page divs (e.g. '.offer-letter-page')
 * @param {string} opts.wrapperSelector – CSS selector for the document wrapper div
 */
export const generateLetterPDF = async ({ fileName, pageSelector, wrapperSelector }) => {
  const pages = document.querySelectorAll(pageSelector);
  if (!pages.length) return;

  // Temporarily reset scale transform so html2pdf captures at full size
  const wrapper = document.querySelector(wrapperSelector);
  const originalStyle = wrapper ? wrapper.getAttribute('style') : null;
  if (wrapper) {
    wrapper.style.setProperty('--doc-scale', '1');
  }

  // Also temporarily force pages to full size (undo any mobile scaling)
  pages.forEach(page => {
    page.style.transform = 'none';
    page.style.marginBottom = '0';
    page.style.width = '210mm';
    page.style.minHeight = '297mm';
  });

  // Small delay to let styles settle
  await new Promise(r => setTimeout(r, 100));

  const opt = {
    margin: 0,
    filename: `${fileName}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: 794,    // 210mm at 96dpi
      windowWidth: 794,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    },
    pagebreak: { mode: ['css', 'legacy'], avoid: ['.official-page-footer'] }
  };

  try {
    // Build PDF page-by-page for multi-page letters
    if (pages.length === 1) {
      await html2pdf().set(opt).from(pages[0]).save();
    } else {
      // Create a temporary container with all pages
      const tempContainer = document.createElement('div');
      tempContainer.style.width = '210mm';
      tempContainer.style.background = '#ffffff';

      pages.forEach((page, i) => {
        const clone = page.cloneNode(true);
        clone.style.width = '210mm';
        clone.style.minHeight = '297mm';
        clone.style.height = '297mm';
        clone.style.transform = 'none';
        clone.style.marginBottom = '0';
        clone.style.boxShadow = 'none';
        clone.style.pageBreakAfter = i < pages.length - 1 ? 'always' : 'auto';
        tempContainer.appendChild(clone);
      });

      document.body.appendChild(tempContainer);
      await html2pdf().set(opt).from(tempContainer).save();
      document.body.removeChild(tempContainer);
    }
  } catch (err) {
    console.error('PDF generation failed:', err);
    // Fallback to window.print()
    window.print();
  } finally {
    // Restore original styles
    pages.forEach(page => {
      page.style.transform = '';
      page.style.marginBottom = '';
      page.style.width = '';
      page.style.minHeight = '';
    });
    if (wrapper && originalStyle !== null) {
      wrapper.setAttribute('style', originalStyle);
    } else if (wrapper) {
      wrapper.removeAttribute('style');
    }
  }
};
