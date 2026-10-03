import React, { useState } from 'react';
import { X, Send, MapPin, AlertOctagon, CheckCircle2, Wifi, WifiOff } from 'lucide-react';
import { api } from '../services/api';

export default function FieldSosModal({ isOpen, onClose, onSubmitted }) {
  const [formData, setFormData] = useState({
    hazardType: 'LANDSLIDE',
    reporterName: 'SDRF Quick Response Team 4',
    contactNumber: '+91 98765 43210',
    latitude: '30.5524',
    longitude: '79.5638',
    affectedCount: '45',
    immediateNeeds: 'Emergency evacuation, medical triage, water rations',
    description: 'Fresh slope deformation observed following intensive rainfall. Structural cracks on 12 houses.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            latitude: pos.coords.latitude.toFixed(4),
            longitude: pos.coords.longitude.toFixed(4)
          }));
        },
        () => {
          setErrorMsg('GPS lock unavailable. Using manual coordinates.');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.submitFieldReport(formData);
      setSuccessMsg(`SOS Dispatched! ${res.message} (Ref: ${res.sosId})`);
      if (onSubmitted) onSubmitted();
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 2500);
    } catch (err) {
      // Offline fallback: Queue in localStorage
      try {
        const queue = JSON.parse(localStorage.getItem('sih_offline_sos') || '[]');
        queue.push({ ...formData, queuedAt: new Date().toISOString() });
        localStorage.setItem('sih_offline_sos', JSON.stringify(queue));
        setSuccessMsg('Network unavailable. Stored in Offline SOS Dispatch Queue. Will auto-sync upon reconnection.');
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
        }, 3000);
      } catch {
        setErrorMsg(`Dispatch failed: ${err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: 540,
        width: '100%',
        backgroundColor: '#0d1527',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        borderRadius: 12,
        padding: '1.5rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(239, 68, 68, 0.2)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertOctagon size={20} color="#ef4444" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Field SOS Incident Dispatch
              </h2>
              <span style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 600 }}>
                Direct Emergency Incident Ingestion with Dynamic Perimeter Generation
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            padding: '0.75rem',
            borderRadius: 8,
            marginBottom: '1rem',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <CheckCircle2 size={16} />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            padding: '0.75rem',
            borderRadius: 8,
            marginBottom: '1rem',
            fontSize: '0.82rem'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>
                HAZARD CATEGORY
              </label>
              <select
                value={formData.hazardType}
                onChange={e => setFormData({ ...formData, hazardType: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#f1f5f9',
                  borderRadius: 6,
                  padding: '0.5rem',
                  fontSize: '0.82rem'
                }}
              >
                <option value="LANDSLIDE">Landslide / Slope Failure</option>
                <option value="FLASH_FLOOD">Flash Flood / Cloudburst</option>
                <option value="EARTHQUAKE">Seismic Ground Fissure</option>
                <option value="ROCKFALL">Rockfall / Debris Flow</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>
                ESTIMATED CASUALTIES / AT RISK
              </label>
              <input
                type="number"
                value={formData.affectedCount}
                onChange={e => setFormData({ ...formData, affectedCount: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#f1f5f9',
                  borderRadius: 6,
                  padding: '0.5rem',
                  fontSize: '0.82rem'
                }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.6rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>
                LATITUDE
              </label>
              <input
                type="text"
                value={formData.latitude}
                onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#f1f5f9',
                  borderRadius: 6,
                  padding: '0.5rem',
                  fontSize: '0.82rem'
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>
                LONGITUDE
              </label>
              <input
                type="text"
                value={formData.longitude}
                onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#f1f5f9',
                  borderRadius: 6,
                  padding: '0.5rem',
                  fontSize: '0.82rem'
                }}
                required
              />
            </div>
            <button
              type="button"
              onClick={handleGetLocation}
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                borderRadius: 6,
                padding: '0.5rem 0.75rem',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
              title="Acquire current GPS location"
            >
              <MapPin size={14} />
              GPS
            </button>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>
              REPORTING OFFICER / UNIT
            </label>
            <input
              type="text"
              value={formData.reporterName}
              onChange={e => setFormData({ ...formData, reporterName: e.target.value })}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#f1f5f9',
                borderRadius: 6,
                padding: '0.5rem',
                fontSize: '0.82rem'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>
              SITUATION BRIEF & OBSERVATIONS
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#f1f5f9',
                borderRadius: 6,
                padding: '0.5rem',
                fontSize: '0.82rem',
                resize: 'none'
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1',
                padding: '0.5rem 1rem',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '0.82rem'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: 'none',
                color: '#ffffff',
                padding: '0.5rem 1.25rem',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)'
              }}
            >
              <Send size={15} />
              {isSubmitting ? 'Transmitting SOS...' : 'Transmit SOS Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
