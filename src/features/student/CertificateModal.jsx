import React, { useState } from 'react';
import { Award, CheckCircle2, Download, Printer, X, Sparkles } from 'lucide-react';
import { Modal } from '../../components/ui/Modal.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { formatDateOnly } from '../../utils/dates.js';

export function CertificateModal({ isOpen, onClose, studentName, eventTitle, eventDate, confirmationCode }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Attendance Certificate" maxWidth={680}>
      <div style={{ marginBottom: '1.5rem' }}>
        {/* Printable Certificate Frame */}
        <div
          id="certificate-print-area"
          style={{
            border: '8px double var(--primary)',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            color: '#0f172a',
            borderRadius: 'var(--radius-md)',
            position: 'relative',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Watermark Seal */}
          <div
            style={{
              width: 56,
              height: 56,
              margin: '0 auto 1rem auto',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Award size={32} />
          </div>

          <span
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: 'var(--primary)',
            }}
          >
            University Campus Activities Board
          </span>

          <h2
            style={{
              fontFamily: 'serif',
              fontSize: '1.85rem',
              fontWeight: 700,
              margin: '0.75rem 0 0.5rem 0',
              color: '#1e293b',
            }}
          >
            Certificate of Participation
          </h2>

          <p style={{ fontStyle: 'italic', color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            This certifies that
          </p>

          <div
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'var(--primary)',
              borderBottom: '2px solid #e2e8f0',
              display: 'inline-block',
              paddingBottom: '0.25rem',
              marginBottom: '1.25rem',
              minWidth: '260px',
            }}
          >
            {studentName}
          </div>

          <p style={{ color: '#475569', fontSize: '0.925rem', maxWidth: '440px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
            has successfully attended and actively participated in the campus event:
            <br />
            <strong style={{ color: '#0f172a', fontSize: '1rem' }}>{eventTitle}</strong>
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px dashed #cbd5e1',
              fontSize: '0.8rem',
              color: '#64748b',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div>Date: <strong>{formatDateOnly(eventDate)}</strong></div>
              <div>Verification: <strong>{confirmationCode}</strong></div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, color: '#1e293b' }}>Dr. Marcus Vance</div>
              <div>Office of Student Affairs</div>
            </div>
          </div>

          {/* Sample disclaimer */}
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 0,
              right: 0,
              fontSize: '0.65rem',
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            ★ Demonstration Certificate Sample • Univents Portal ★
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" icon={Printer} onClick={handlePrint}>
          Print / Save PDF
        </Button>
      </div>
    </Modal>
  );
}
