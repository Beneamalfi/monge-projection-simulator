import React, { useEffect, useRef } from 'react';
import { projectPointOnMonge, flipPVAroundLT, flipPLAroundLT } from '../utils/geometry';

/**
 * COMPONENTE MONGE PANEL
 * ======================
 * 
 * Visualizza le proiezioni ortogonali secondo il metodo di Monge.
 * 
 * Layout del disegno Monge:
 * ┌─────────────────┬─────────────────┐
 * │                 │                 │
 * │  PV (superiore) │  PL (laterale)  │
 * │                 │                 │
 * ├─────────────────┼─────────────────┤
 * │                 │                 │
 * │  PO (inferiore) │                 │
 * │                 │                 │
 * └─────────────────┴─────────────────┘
 * 
 * La Linea di Terra (LT) separa PV da PO orizzontalmente.
 * Le proiezioni sono collegate da linee di rinvio (costruzione).
 */

const MongePanel = ({ points = [] }) => {
  const canvasRef = useRef(null);
  const SCALE = 20; // Pixel per unità
  const OFFSET_X = 300;
  const OFFSET_Y = 250;
  const LT_Y = 250; // Posizione della Linea di Terra

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ========== STILE E IMPOSTAZIONI ==========
    ctx.strokeStyle = '#333';
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 1;

    // ========== DISEGNA SFONDO ==========
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ========== DISEGNA LINEA DI TERRA (LT) ==========
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, LT_Y);
    ctx.lineTo(canvas.width, LT_Y);
    ctx.stroke();

    // Etichetta LT
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('LT (Linea di Terra)', 10, LT_Y - 10);

    // ========== ASSI E ETICHETTE PIANI ==========
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Asse verticale (separa PV da PL)
    ctx.beginPath();
    ctx.moveTo(OFFSET_X, 0);
    ctx.lineTo(OFFSET_X, canvas.height);
    ctx.stroke();

    // Asse orizzontale inferiore (separa PO da area vuota)
    ctx.beginPath();
    ctx.moveTo(0, OFFSET_Y);
    ctx.lineTo(OFFSET_X, OFFSET_Y);
    ctx.stroke();

    ctx.setLineDash([]);

    // Etichette piani
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.fillText('PV (Piano Verticale)', 20, 30);
    ctx.fillText('PO (Piano Orizzontale)', 20, OFFSET_Y + 30);
    ctx.fillText('PL (Piano Laterale)', OFFSET_X + 20, 30);

    // ========== DISEGNA PUNTI E PROIEZIONI ==========
    points.forEach((point, index) => {
      const projections = projectPointOnMonge(point.x, point.y, point.z);

      // Colore per il punto
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
      const color = colors[index % colors.length];

      // ===== PROIEZIONE SU PV (XZ) =====
      // Piano Verticale: X va a destra, Z va in alto
      const pvX = OFFSET_X / 2 + projections.pv.x * SCALE;
      const pvY = LT_Y - projections.pv.z * SCALE;

      // Disegna punto PV
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pvX, pvY, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Etichetta punto PV
      ctx.fillStyle = color;
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`P${index + 1}''`, pvX + 8, pvY - 8);

      // ===== PROIEZIONE SU PO (XY) =====
      // Piano Orizzontale: X va a destra, Y va in basso (invertito)
      const poX = OFFSET_X / 2 + projections.po.x * SCALE;
      const poY = LT_Y + projections.po.y * SCALE;

      // Disegna punto PO
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(poX, poY, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Etichetta punto PO
      ctx.fillStyle = color;
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`P${index + 1}'`, poX + 8, poY + 15);

      // ===== PROIEZIONE SU PL (YZ) =====
      // Piano Laterale: Y va a sinistra, Z va in alto
      const plX = OFFSET_X + (OFFSET_X / 2) - projections.pl.y * SCALE;
      const plY = LT_Y - projections.pl.z * SCALE;

      // Disegna punto PL
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(plX, plY, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Etichetta punto PL
      ctx.fillStyle = color;
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`P${index + 1}'''`, plX - 35, plY - 8);

      // ===== LINEE DI RINVIO (COSTRUZIONE) =====
      // Linea tra P' e P'' (verticale lungo la Linea di Terra)
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(pvX, LT_Y);
      ctx.lineTo(poX, LT_Y);
      ctx.stroke();

      // Linea tra P'' e P''' (orizzontale lungo la Linea di Terra)
      ctx.beginPath();
      ctx.moveTo(OFFSET_X, pvY);
      ctx.lineTo(OFFSET_X, plY);
      ctx.stroke();

      // Linea di connessione P''' a LT
      ctx.beginPath();
      ctx.moveTo(plX, LT_Y);
      ctx.lineTo(plX, plY);
      ctx.stroke();

      ctx.setLineDash([]);

      // ===== INFORMAZIONI PUNTO =====
      ctx.fillStyle = '#333';
      ctx.font = '11px monospace';
      const infoY = 80 + index * 35;
      ctx.fillText(`P${index + 1}: (${point.x.toFixed(1)}, ${point.y.toFixed(1)}, ${point.z.toFixed(1)})`, 10, infoY);
      ctx.fillStyle = color;
      ctx.fillText(`PV: (${projections.pv.x.toFixed(1)}, ${projections.pv.z.toFixed(1)})`, 10, infoY + 12);
      ctx.fillStyle = color;
      ctx.fillText(`PO: (${projections.po.x.toFixed(1)}, ${projections.po.y.toFixed(1)})`, 10, infoY + 24);
    });

    // ========== LEGENDA ==========
    ctx.fillStyle = '#666';
    ctx.font = '11px Arial';
    const legendY = canvas.height - 60;
    ctx.fillText("P' = Proiezione su PO (Piano Orizzontale)", 10, legendY);
    ctx.fillText("P'' = Proiezione su PV (Piano Verticale)", 10, legendY + 15);
    ctx.fillText("P''' = Proiezione su PL (Piano Laterale)", 10, legendY + 30);

  }, [points]);

  return (
    <div className="monge-panel">
      <h2>📐 Proiezioni di Monge</h2>
      <canvas
        ref={canvasRef}
        width={700}
        height={600}
        style={{
          border: '2px solid #333',
          backgroundColor: '#fafafa',
          borderRadius: '4px'
        }}
      />
      <div className="monge-info">
        <p>
          <strong>Metodo di Monge:</strong> Proiezioni ortogonali su tre piani mutuamente perpendicolari.
          Le linee tratteggiate sono linee di rinvio (costruzione).
        </p>
      </div>
    </div>
  );
};

export default MongePanel;
