import React, { useState } from 'react';

/**
 * COMPONENTE CONTROL PANEL
 * ========================
 * 
 * Pannello di controllo per l'inserimento delle coordinate dei punti.
 * Permette all'utente di:
 * - Inserire coordinate X, Y, Z
 * - Aggiungere punti alla scena 3D
 * - Eliminare punti
 * - Visualizzare la lista dei punti inseriti
 */

const ControlPanel = ({ points = [], onAddPoint, onRemovePoint }) => {
  const [x, setX] = useState(5);
  const [y, setY] = useState(5);
  const [z, setZ] = useState(5);

  const handleAddPoint = (e) => {
    e.preventDefault();
    const newPoint = {
      x: parseFloat(x),
      y: parseFloat(y),
      z: parseFloat(z)
    };
    onAddPoint(newPoint);
    // Reset form
    setX(0);
    setY(0);
    setZ(0);
  };

  return (
    <div className="control-panel">
      <h2>🎯 Inserisci Punti</h2>
      
      <form onSubmit={handleAddPoint} className="input-form">
        <div className="input-group">
          <label htmlFor="x">X:</label>
          <input
            id="x"
            type="number"
            step="0.5"
            value={x}
            onChange={(e) => setX(e.target.value)}
            placeholder="Coordinata X"
          />
        </div>

        <div className="input-group">
          <label htmlFor="y">Y:</label>
          <input
            id="y"
            type="number"
            step="0.5"
            value={y}
            onChange={(e) => setY(e.target.value)}
            placeholder="Coordinata Y"
          />
        </div>

        <div className="input-group">
          <label htmlFor="z">Z:</label>
          <input
            id="z"
            type="number"
            step="0.5"
            value={z}
            onChange={(e) => setZ(e.target.value)}
            placeholder="Coordinata Z"
          />
        </div>

        <button type="submit" className="btn-add">
          ➕ Aggiungi Punto
        </button>
      </form>

      <div className="points-list">
        <h3>📍 Punti Inseriti ({points.length})</h3>
        {points.length === 0 ? (
          <p className="empty-state">Nessun punto inserito</p>
        ) : (
          <ul>
            {points.map((point, index) => (
              <li key={index} className="point-item">
                <span className="point-label">P{index + 1}</span>
                <span className="point-coords">
                  ({point.x.toFixed(2)}, {point.y.toFixed(2)}, {point.z.toFixed(2)})
                </span>
                <button
                  className="btn-remove"
                  onClick={() => onRemovePoint(index)}
                  title="Elimina questo punto"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="info-section">
        <h3>ℹ️ Informazioni</h3>
        <p>
          Inserisci le coordinate (X, Y, Z) per creare punti nello spazio 3D.
          Osserva come vengono proiettati sui tre piani di Monge.
        </p>
        <ul className="plane-info">
          <li><strong>PO (Piano Orizzontale):</strong> Piano XY</li>
          <li><strong>PV (Piano Verticale):</strong> Piano XZ</li>
          <li><strong>PL (Piano Laterale):</strong> Piano YZ</li>
        </ul>
      </div>
    </div>
  );
};

export default ControlPanel;
