import React, { useState } from 'react';
import Viewer3D from './components/Viewer3D';
import ControlPanel from './components/ControlPanel';
import MongePanel from './components/MongePanel';
import './App.css';

/**
 * COMPONENTE PRINCIPALE APP
 * =========================
 * 
 * Integra i tre componenti principali:
 * 1. ControlPanel - Pannello di controllo per inserire punti
 * 2. Viewer3D - Visualizzatore 3D interattivo
 * 3. MongePanel - Pannello delle proiezioni 2D di Monge
 * 
 * Gestisce lo stato globale dei punti inseriti.
 */

function App() {
  const [points, setPoints] = useState([]);

  const handleAddPoint = (newPoint) => {
    setPoints([...points, newPoint]);
  };

  const handleRemovePoint = (index) => {
    setPoints(points.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    if (window.confirm('Sei sicuro di voler eliminare tutti i punti?')) {
      setPoints([]);
    }
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="app-header">
        <h1>🎓 Simulatore di Proiezioni Ortogonali - Metodo di Monge</h1>
        <p>Visualizzazione interattiva della Geometria Descrittiva</p>
      </header>

      {/* MAIN CONTENT */}
      <main className="app-main">
        {/* LEFT PANEL - CONTROLS */}
        <aside className="left-panel">
          <ControlPanel 
            points={points} 
            onAddPoint={handleAddPoint}
            onRemovePoint={handleRemovePoint}
          />
          <button 
            className="btn-clear-all" 
            onClick={handleClearAll}
            disabled={points.length === 0}
          >
            🗑️ Cancella Tutto
          </button>
        </aside>

        {/* CENTER & RIGHT - 3D AND MONGE */}
        <div className="content-area">
          {/* TOP - 3D VIEWER */}
          <div className="viewer-container">
            <div className="viewer-header">
              <h2>🔄 Visualizzazione 3D</h2>
              <p className="viewer-hint">Trascina il mouse per ruotare | Rotella per ingrandire/rimpicciolire</p>
            </div>
            <Viewer3D points={points} />
          </div>

          {/* BOTTOM - MONGE PANEL */}
          <div className="monge-container">
            <MongePanel points={points} />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>📚 Metodo di Monge</h3>
            <p>
              Il metodo di Monge è un sistema di rappresentazione grafica che permette
              di disegnare oggetti tridimensionali su un foglio bidimensionale mediante
              proiezioni ortogonali su tre piani di proiezione mutuamente perpendicolari.
            </p>
          </div>
          <div className="footer-section">
            <h3>🎯 Come Usare</h3>
            <ol>
              <li>Inserisci le coordinate (X, Y, Z) nel pannello a sinistra</li>
              <li>Clicca "Aggiungi Punto" per visualizzare il punto nello spazio 3D</li>
              <li>Osserva le proiezioni nel riquadro inferiore destro</li>
              <li>Ruota la vista 3D con il mouse per comprendre meglio la geometria</li>
            </ol>
          </div>
          <div className="footer-section">
            <h3>📐 Piani di Proiezione</h3>
            <ul>
              <li><strong>PO:</strong> Piano Orizzontale (XY)</li>
              <li><strong>PV:</strong> Piano Verticale (XZ)</li>
              <li><strong>PL:</strong> Piano Laterale (YZ)</li>
              <li><strong>LT:</strong> Linea di Terra (intersezione PO-PV)</li>
            </ul>
          </div>
        </div>
        <p className="footer-credit">
          Creato come strumento educativo per la Geometria Descrittiva • 
          <a href="https://github.com/Beneamalfi/monge-projection-simulator" target="_blank" rel="noopener noreferrer">
            Visualizza il codice su GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
